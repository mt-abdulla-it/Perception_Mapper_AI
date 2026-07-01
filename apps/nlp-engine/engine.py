import re
from langdetect import detect

# Multilingual dictionaries for tone keyword matching
TONE_DICTIONARIES = {
  "en": {
    "Formal": ["therefore", "furthermore", "consequently", "subsequently", "accordingly", "nevertheless"],
    "Assertive": ["must", "definitely", "absolutely", "crucial", "essential", "demand", "unquestionably"],
    "Emotional": ["horrible", "amazing", "wonderful", "terrible", "disgusting", "loved", "hated", "heartbroken"],
    "Cooperative": ["collaborate", "agree", "support", "help", "together", "understanding", "consensus"],
  },
  "ta": {
    "Formal": ["எனவே", "மேலும்", "இதன் விளைவாக", "இருப்பினும்", "முறையாக"],
    "Assertive": ["கண்டிப்பாக", "நிச்சயமாக", "முக்கியமான", "அவசியமான", "உறுதியாக"],
    "Emotional": ["மிகவும்", "அதிர்ச்சி", "அற்புதம்", "கொடுமை", "மகிழ்ச்சி", "வருத்தம்"],
    "Cooperative": ["ஒத்துழைப்பு", "உதவி", "ஒப்புக்கொள்கிறேன்", "ஒன்றாக", "புரிந்துணர்வு"],
  },
  "si": {
    "Formal": ["එබැවින්", "තවද", "එහි ප්‍රතිඵලයක් ලෙස", "කෙසේ වෙතත්", "පරිදි"],
    "Assertive": ["අනිවාර්යයෙන්ම", "නියත වශයෙන්ම", "වැදගත්", "අත්‍යවශ්‍ය", "ස්ථිරවම"],
    "Emotional": ["ඉතාමත්", "කණගාටුයි", "අතිශය", "පුදුම සහගත", "භයානක"],
    "Cooperative": ["සහයෝගීතාවය", "එකඟතාවය", "සහාය", "එක්ව", "අන්‍යෝන්‍ය"],
  }
}

# Cognitive bias keyword classification
BIAS_DICTIONARIES = {
  "en": [
    {
      "pattern": r"(?<!\w)(always|never|everyone|nobody)(?!\w)",
      "type": "Over-generalization",
      "description": "Uses absolute statements that fail to accommodate context nuances.",
      "rephrase": "most cases / some individuals"
    },
    {
      "pattern": r"(?<!\w)(obviously|clearly|undeniably|without a doubt)(?!\w)",
      "type": "Confirmation Bias",
      "description": "Presents assumptions as verified absolute facts to reinforce beliefs.",
      "rephrase": "evidence suggests / indications point to"
    },
    {
      "pattern": r"(?<!\w)(shocking|unbelievable|disaster|conspiracy|crisis)(?!\w)",
      "type": "Sensationalism",
      "description": "Employs dramatic phrasing to provoke visceral emotional reactions rather than objective analysis.",
      "rephrase": "significant / noteworthy event / challenging circumstance"
    },
    {
      "pattern": r"(?<!\w)(either we|must choose between|only two choices|black or white)(?!\w)",
      "type": "False Dilemma",
      "description": "Presents complex choices as simple binary either/or decisions.",
      "rephrase": "considering multiple alternatives"
    },
    {
      "pattern": r"(?<!\w)(stupid|idiot|hypocrite|liar|corrupt|incompetent)(?!\w)",
      "type": "Ad Hominem",
      "description": "Attacks the character or traits of an individual rather than addressing their logical argument.",
      "rephrase": "the argument presented"
    },
    {
      "pattern": r"(?<!\w)(pathetic|terrifying|horrendous|heartbreaking|outrageous)(?!\w)",
      "type": "Appeal to Emotion",
      "description": "Attempts to manipulate an emotional reaction to distract from objective or rational reasoning.",
      "rephrase": "concerning aspect / challenging factor"
    }
  ],
  "ta": [
    {
      "pattern": r"(?<![\w\u0b80-\u0bff])(எப்போதுமே|ஒருபோதும்|எல்லாரும்|யாரும்|முற்றிலும்|அனைவரும்|யாரும் இல்லை)(?![\w\u0b80-\u0bff])",
      "type": "Over-generalization (பொதுமைப்படுத்தல் சார்பு)",
      "description": "சூழல் நுணுக்கங்களுக்கு இடமளிக்காத முழுமையான அறிக்கைகளைப் பயன்படுத்துகிறது.",
      "rephrase": "பெரும்பாலான சந்தர்ப்பங்களில் / சில தனிநபர்கள்"
    },
    {
      "pattern": r"(?<![\w\u0b80-\u0bff])(வெளிப்படையாக|நிச்சயமாக|சந்தேகமின்றி|நிச்சயமாகவே|உண்மையிலேயே)(?![\w\u0b80-\u0bff])",
      "type": "Confirmation Bias (உறுதிப்படுத்தல் சார்பு)",
      "description": "நம்பிக்கைகளை வலுப்படுத்த சரிபார்க்கப்பட்ட உண்மைகளாக அனுமானங்களை முன்வைக்கிறது.",
      "rephrase": "சான்றுகள் குறிப்பிடுகின்றன / சுட்டிக்காட்டுகின்றன"
    },
    {
      "pattern": r"(?<![\w\u0b80-\u0bff])(அதிர்ச்சி|பேரழிவு|சதி|நெருக்கடி|அதிர்ச்சியூட்டும்|பயங்கரமான)(?![\w\u0b80-\u0bff])",
      "type": "Sensationalism (உணர்ச்சிவசப்படுத்துதல் சார்பு)",
      "description": "பகுப்பாய்வை விட உணர்ச்சிபூர்வமான எதிர்வினைகளைத் தூண்டுவதற்கு வியத்தகு சொற்களைப் பயன்படுத்துகிறது.",
      "rephrase": "கவனிக்கத்தக்க நிகழ்வு / சவாலான சூழ்நிலை"
    },
    {
      "pattern": r"(?<![\w\u0b80-\u0bff])(ஒன்றில்|அல்லது|இரண்டில் ஒன்று|வேறு வழியே இல்லை)(?![\w\u0b80-\u0bff])",
      "type": "False Dilemma (தவறான இருநிலைத் தேர்வு)",
      "description": "சிக்கலான தேர்வுகளை எளிய இருநிலைத் தேர்வுகளாக முன்வைக்கிறது.",
      "rephrase": "மாற்று வழிகளைக் கருத்தில் கொள்கிறது"
    },
    {
      "pattern": r"(?<![\w\u0b80-\u0bff])(முட்டாள்|ஏமாற்றுக்காரன்|பொய்யன்|ஊழல்வாதி|திறமையற்றவர்)(?![\w\u0b80-\u0bff])",
      "type": "Ad Hominem (நபர் சார்பு தாக்குதல்)",
      "description": "தர்க்கரீதியான வாதத்திற்குப் பதில் நபரின் தன்மையைத் தாக்குகிறது.",
      "rephrase": "முன்வைக்கப்பட்ட வாதம்"
    },
    {
      "pattern": r"(?<![\w\u0b80-\u0bff])(பரிதாபகரமான|பயங்கரமான|நெஞ்சை உலுக்கும்|அபத்தமான)(?![\w\u0b80-\u0bff])",
      "type": "Appeal to Emotion (உணர்ச்சி தூண்டல் சார்பு)",
      "description": "பகுத்தறிவுக்குப் பதிலாக உணர்ச்சிகரமான எதிர்வினையைத் தூண்ட முயல்கிறது.",
      "rephrase": "கடினமான அம்சம் / சவாலான காரணி"
    }
  ],
  "si": [
    {
      "pattern": r"(?<![\w\u0d80-\u0dff\u200c\u200d])(සෑමවිටම|කිසිවිටෙකත්|සෑමදෙනාම|කිසිවෙකුත්|සම්පූර්ණයෙන්ම|සියලු දෙනා)(?![\w\u0d80-\u0dff\u200c\u200d])",
      "type": "Over-generalization (අති-සාමාන්‍යකරණය)",
      "description": "සන්දර්භීය සූක්ෂ්මතා සැලකිල්ලට නොගෙන නිරපේක්ෂ ප්‍රකාශ භාවිතා කරයි.",
      "rephrase": "බොහෝ අවස්ථාවලදී / සමහර පුද්ගලයන්"
    },
    {
      "pattern": r"(?<![\w\u0d80-\u0dff\u200c\u200d])(පැහැදිලිවම|නිසැකවම|සැකයකින් තොරව|නියත වශයෙන්ම|ඇත්ත වශයෙන්ම)(?![\w\u0d80-\u0dff\u200c\u200d])",
      "type": "Confirmation Bias (තහවුරු කිරීමේ නැඹුරුව)",
      "description": "විශ්වාසයන් ශක්තිමත් කිරීම සඳහා උපකල්පන සත්‍යාපිත කරුණු ලෙස ඉදිරිපත් කරයි.",
      "rephrase": "සාක්ෂි මගින් පෙන්වා දෙන්නේ / ඉඟි කරන්නේ"
    },
    {
      "pattern": r"(?<![\w\u0d80-\u0dff\u200c\u200d])(අතිශය|ව්‍යසනයක්|කුමන්ත්‍රණය|අර්බුදය|කම්පන සහගත|මහා විනාශයක්)(?![\w\u0d80-\u0dff\u200c\u200d])",
      "type": "Sensationalism (ආන්දෝලනාත්මකකරණය)",
      "description": "විෂයමූලික විශ්ලේෂණයකට වඩා හැඟීම් අවදි කිරීමට නාට්‍යමය වාක්‍ය ඛණ්ඩ භාවිතා කරයි.",
      "rephrase": "සැලකිය යුතු / අභියෝගාත්මක තත්ත්වය"
    },
    {
      "pattern": r"(?<![\w\u0d80-\u0dff\u200c\u200d])(එක්කෝ|නැත්නම්|විකල්ප නැත|දෙකෙන් එකක්)(?![\w\u0d80-\u0dff\u200c\u200d])",
      "type": "False Dilemma (ව්‍යාජ උභතෝකෝටිකය)",
      "description": "සංකීර්ණ තේරීම් සරල ද්විමය විකල්ප ලෙස ඉදිරිපත් කරයි.",
      "rephrase": "විකල්ප කිහිපයක් සලකා බැලීම"
    },
    {
      "pattern": r"(?<![\w\u0d80-\u0dff\u200c\u200d])(මෝඩයා|තක්කඩියා|බොරුවකාරයා|දූෂිත|අදක්ෂයා)(?![\w\u0d80-\u0dff\u200c\u200d])",
      "type": "Ad Hominem (පුද්ගල ප්‍රහාරය)",
      "description": "තර්කානුකූල තර්කය වෙනුවට පුද්ගලයාගේ චරිතයට පහර දෙයි.",
      "rephrase": "ඉදිරිපත් කළ තර්කය"
    },
    {
      "pattern": r"(?<![\w\u0d80-\u0dff\u200c\u200d])(ඛේදජනක|භයානක|හදවත කම්පා කරවන|නින්දිත)(?![\w\u0d80-\u0dff\u200c\u200d])",
      "type": "Appeal to Emotion (හැඟීම් අවදි කිරීමේ නැඹුරුව)",
      "description": "හේතුවාදී තර්කනය වෙනුවට හැඟීම් සහගත ප්‍රතිචාරයක් ඇති කිරීමට උත්සාහ කරයි.",
      "rephrase": "අභියෝගාත්මක කරුණ"
    }
  ]
}

# Advanced SpaCy & Deep-learning Zero-Shot integration support
nlp = None
try:
    import spacy
    try:
        nlp = spacy.load("en_core_web_sm")
    except Exception:
        # Fallback if package is present but model is not downloaded
        pass
except ImportError:
    pass

zero_shot_pipeline = None
try:
    import os
    if os.getenv("USE_ZERO_SHOT", "false").lower() == "true":
        from transformers import pipeline
        # Pluggable zero-shot classification model pipeline
        zero_shot_pipeline = pipeline("zero-shot-classification", model="facebook/bart-large-mnli", device=-1)
except Exception:
    pass

def analyze_perception(text: str):
  # 1. Detect language
  try:
    detected_lang = detect(text)
    if detected_lang not in ["ta", "si"]:
      detected_lang = "en"
  except Exception:
    detected_lang = "en"
    
  language_names = {"en": "English", "ta": "Tamil", "si": "Sinhala"}
  lang_label = language_names.get(detected_lang, "English")

  # 2. Advanced NLP Tokenization and Tone calculations
  tones = []
  
  if nlp and detected_lang == "en":
    doc = nlp(text)
    words = [token.text.lower() for token in doc if not token.is_punct]
  else:
    words = re.findall(r"\w+", text.lower())
    
  total_words = len(words) if len(words) > 0 else 1

  dict_to_use = TONE_DICTIONARIES.get(detected_lang, TONE_DICTIONARIES["en"])
  
  default_scores = {
    "en": {"Informative": 70, "Assertive": 30, "Cooperative": 50, "Formal": 40},
    "ta": {"Informative": 65, "Assertive": 25, "Cooperative": 55, "Formal": 45},
    "si": {"Informative": 68, "Assertive": 28, "Cooperative": 52, "Formal": 42}
  }
  
  scores = default_scores[detected_lang].copy()
  
  # Try to use neural classifier if available for advanced sentiment mapping
  if zero_shot_pipeline and detected_lang == "en":
    try:
      candidate_labels = ["Informative", "Formal", "Assertive", "Cooperative", "Emotional"]
      res = zero_shot_pipeline(text, candidate_labels=candidate_labels)
      for label, score in zip(res["labels"], res["scores"]):
        scores[label] = int(score * 100)
    except Exception:
      pass
  else:
    # Lexicon frequency keyword matching
    for tone, keywords in dict_to_use.items():
      match_count = sum(1 for w in words if w in keywords)
      if match_count > 0:
        if tone not in scores:
          scores[tone] = 30
        scores[tone] = min(100, scores[tone] + (match_count * 15))

  tone_colors = {
    "Informative": "from-blue-500 to-indigo-500",
    "Formal": "from-slate-500 to-slate-700",
    "Assertive": "from-purple-500 to-pink-500",
    "Cooperative": "from-emerald-500 to-teal-500",
    "Emotional": "from-red-500 to-orange-500"
  }

  for name, score in scores.items():
    tones.append({
      "name": name,
      "score": score,
      "color": tone_colors.get(name, "from-slate-500 to-slate-700")
    })

  # 3. Bias scans (regex pattern matching)
  biases = []
  bias_index = 20 # baseline
  
  rules_to_use = BIAS_DICTIONARIES.get(detected_lang, BIAS_DICTIONARIES["en"])
  
  for rule in rules_to_use:
    matches = re.finditer(rule["pattern"], text, re.IGNORECASE)
    for match in matches:
      matched_text = match.group(0)
      
      # Extract sentence surrounding match
      start = max(0, text.rfind(".", 0, match.start()) + 1)
      end = text.find(".", match.end())
      if end == -1:
        end = len(text)
      sentence = text[start:end].strip()
      
      # Substitute biased term with objective alternative
      rephrased_sentence = re.sub(
        re.escape(matched_text), 
        rule["rephrase"], 
        sentence, 
        flags=re.IGNORECASE
      )
      
      biases.append({
        "quote": sentence if len(sentence) < 150 else sentence[:147] + "...",
        "type": rule["type"],
        "description": rule["description"],
        "rephrase": rephrased_sentence
      })
      bias_index = min(100, bias_index + 25)

  return {
    "language": lang_label,
    "scores": {
      "sentiment": 75 if bias_index < 50 else 45,
      "objectivity": max(0, 100 - bias_index),
      "biasIndex": bias_index
    },
    "tones": tones,
    "biases": biases if biases else [{
      "quote": text[:60] + "..." if len(text) > 60 else text,
      "type": "Objective Statement",
      "description": "No immediate high-level cognitive bias patterns matched.",
      "rephrase": "Content is balanced and ready for output."
    }]
  }
