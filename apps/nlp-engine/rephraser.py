import os
import re

try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

def generate_alternatives(text: str, language: str = "en", api_key: str = None) -> dict:
    if not api_key:
        api_key = os.getenv("GEMINI_API_KEY")
    if HAS_GENAI and api_key:
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            prompt = f"""
            You are an advanced AI rephraser for a cognitive bias and tone analysis engine.
            Your task is to rephrase the following text into three distinct communication styles:
            
            1. "journalistic": Make it completely objective, factual, and neutral. Remove any loaded language, emotional amplification, and personal confirmation bias.
            2. "empathetic": Make it warm, understanding, cooperative, and collaborative. Focus on consensus and connection.
            3. "professional": Make it assertive, polite, clear, and business-focused. Professional and direct.
            
            Input Text: "{text}"
            Target Language: {language}
            
            Return the result ONLY as a JSON object with the following keys: "journalistic", "empathetic", "professional".
            Do not include any markdown styling, code blocks, or extra text. Return the raw JSON string.
            """
            
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            import json
            return json.loads(response_text.strip())
        except Exception as e:
            # Fallback if call fails
            pass
            
    # Mock / Rule-Based Template Fallback Generator
    clean_text = text.strip()
    
    if language == "ta" or any(char in clean_text for char in ["அ", "ஆ", "இ", "ஈ", "உ"]):
        # Tamil rephrasing
        # Try to clean common words
        clean_text = clean_text.replace("எப்போதுமே", "பெரும்பாலான சந்தர்ப்பங்களில்")
        clean_text = clean_text.replace("ஒருபோதும்", "சில நேரங்களில்")
        clean_text = clean_text.replace("எல்லாரும்", "சிலர்")
        clean_text = clean_text.replace("யாரும் இல்லை", "குறிப்பிட்ட சிலரே")
        clean_text = clean_text.replace("யாரும்", "சில தனிநபர்கள்")
        clean_text = clean_text.replace("முற்றிலும்", "பகுதியளவு")
        clean_text = clean_text.replace("அனைவரும்", "பலர்")
        clean_text = clean_text.replace("வெளிப்படையாக", "சான்றுகள் குறிப்பிடுகின்றன")
        clean_text = clean_text.replace("நிச்சயமாகவே", "உண்மையிலேயே")
        clean_text = clean_text.replace("நிச்சயமாக", "சாத்தியமாக")
        clean_text = clean_text.replace("சந்தேகமின்றி", "அநேகமாக")
        clean_text = clean_text.replace("உண்மையிலேயே", "குறிப்பிடத்தக்க வகையில்")
        clean_text = clean_text.replace("அதிர்ச்சியூட்டும்", "குறிப்பிடத்தக்க")
        clean_text = clean_text.replace("அதிர்ச்சி", "கவனிக்கத்தக்க நிகழ்வு")
        clean_text = clean_text.replace("பேரழிவு", "சவாலான சூழ்நிலை")
        clean_text = clean_text.replace("சதி", "நிகழ்வு")
        clean_text = clean_text.replace("நெருக்கடி", "கடினமான சூழல்")
        clean_text = clean_text.replace("பயங்கரமான", "சவாலான")
        
        return {
            "journalistic": f"ஆவணப்படுத்தப்பட்ட சான்றுகளின்படி: {clean_text}",
            "empathetic": f"ஒத்துழைப்புடன் கூடிய புரிந்துணர்வின் அடிப்படையில்: {clean_text}",
            "professional": f"முறையாகவும் அதிகாரப்பூர்வமாகவும்: {clean_text}"
        }
    elif language == "si" or any(char in clean_text for char in ["අ", "ආ", "ඇ", "ඈ", "ඉ"]):
        # Sinhala rephrasing
        clean_text = clean_text.replace("සෑමවිටම", "බොහෝ අවස්ථාවලදී")
        clean_text = clean_text.replace("කිසිවිටෙකත්", "කලාතුරකින්")
        clean_text = clean_text.replace("සෑමදෙනාම", "බොහෝ අය")
        clean_text = clean_text.replace("කිසිවෙකුත්", "සමහර පුද්ගලයන්")
        clean_text = clean_text.replace("සම්පූර්ණයෙන්ම", "යම් දුරකට")
        clean_text = clean_text.replace("සියලු දෙනා", "බොහෝ දෙනෙක්")
        clean_text = clean_text.replace("පැහැදිලිවම", "සාක්ෂි මගින් පෙන්වා දෙන්නේ")
        clean_text = clean_text.replace("නිසැකවම", "සමහර විට")
        clean_text = clean_text.replace("සැකයකින් තොරව", "දැනට ඇති තොරතුරු අනුව")
        clean_text = clean_text.replace("නියත වශයෙන්ම", "පෙනෙන පරිදි")
        clean_text = clean_text.replace("ඇත්ත වශයෙන්ම", "සැලකිය යුතු ලෙස")
        clean_text = clean_text.replace("අතිශය", "සැලකිය යුතු")
        clean_text = clean_text.replace("මහා විනාශයක්", "විශාල අභියෝගයක්")
        clean_text = clean_text.replace("ව්‍යසනයක්", "අභියෝගාත්මක තත්ත්වය")
        clean_text = clean_text.replace("කුමන්ත්‍රණය", "සිදුවීම")
        clean_text = clean_text.replace("අර්බුදය", "දුෂ්කර තත්ත්වය")
        clean_text = clean_text.replace("කම්පන සහගත", "අනපේක්ෂිත")
        
        return {
            "journalistic": f"සත්‍යාපිත කරුණු සහ විශ්ලේෂණය අනුව: {clean_text}",
            "empathetic": f"සහයෝගීතාවය සහ අන්‍යෝන්‍ය අවබෝධය මත: {clean_text}",
            "professional": f"නිල ප්‍රකාශ සහ ව්‍යාපාරික සන්නිවේදනය අනුව: {clean_text}"
        }
    else:
        # English rephrasing
        clean_text = clean_text.replace("absolute disaster", "significant challenge")
        clean_text = clean_text.replace("completely unbelievable", "unexpected")
        clean_text = clean_text.replace("everyone", "many people")
        clean_text = clean_text.replace("always", "frequently")
        clean_text = clean_text.replace("never", "rarely")
        clean_text = clean_text.replace("obviously", "seemingly")
        clean_text = clean_text.replace("without a doubt", "based on indicators")
        
        return {
            "journalistic": clean_text,
            "empathetic": f"We appreciate your perspective on this. {clean_text}",
            "professional": f"Please be advised of the current situation. {clean_text}"
        }
