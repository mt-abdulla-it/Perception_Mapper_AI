"""
Perception Mapper AI — NLP Engine Unit Tests

Tests for the core analysis engine covering:
- Language detection (English, Tamil, Sinhala)
- Bias detection (all 6 bias types per language)
- Tone scoring
- Edge cases (empty strings, long text, mixed language)
"""

import pytest
from engine import analyze_perception, BIAS_DICTIONARIES, TONE_DICTIONARIES


class TestLanguageDetection:
    """Verify language detection for all supported locales."""

    def test_english_detection(self):
        result = analyze_perception("This is clearly an obvious disaster for everyone involved.")
        assert result["language"] == "English"

    def test_tamil_detection(self):
        result = analyze_perception("நிச்சயமாக இது எல்லாரும் அறிந்த உண்மை.")
        assert result["language"] == "Tamil"

    def test_sinhala_detection(self):
        result = analyze_perception("නිසැකවම මෙම ක්‍රමය අසාර්ථකයි.")
        assert result["language"] == "Sinhala"


class TestBiasDetection:
    """Verify bias classification matches for each bias type."""

    def test_overgeneralization_detected(self):
        result = analyze_perception("Everyone always agrees with this approach, nobody ever disagrees.")
        bias_types = [b["type"] for b in result["biases"]]
        assert "Over-generalization" in bias_types

    def test_confirmation_bias_detected(self):
        result = analyze_perception("Obviously, this is clearly the correct interpretation without a doubt.")
        bias_types = [b["type"] for b in result["biases"]]
        assert "Confirmation Bias" in bias_types

    def test_sensationalism_detected(self):
        result = analyze_perception("This shocking disaster is an unbelievable crisis for the nation.")
        bias_types = [b["type"] for b in result["biases"]]
        assert "Sensationalism" in bias_types

    def test_false_dilemma_detected(self):
        result = analyze_perception("Either we accept this proposal or face total ruin, only two choices exist.")
        bias_types = [b["type"] for b in result["biases"]]
        assert "False Dilemma" in bias_types

    def test_ad_hominem_detected(self):
        result = analyze_perception("The politician is a corrupt idiot who cannot be trusted.")
        bias_types = [b["type"] for b in result["biases"]]
        assert "Ad Hominem" in bias_types

    def test_appeal_to_emotion_detected(self):
        result = analyze_perception("This heartbreaking situation is truly terrifying and outrageous.")
        bias_types = [b["type"] for b in result["biases"]]
        assert "Appeal to Emotion" in bias_types

    def test_no_bias_returns_objective(self):
        result = analyze_perception("The report indicates a moderate increase in quarterly revenue figures.")
        bias_types = [b["type"] for b in result["biases"]]
        assert "Objective Statement" in bias_types

    def test_tamil_bias_detection(self):
        result = analyze_perception("நிச்சயமாக இது எப்போதுமே நடக்கும் அதிர்ச்சியூட்டும் நிகழ்வு.")
        bias_types = [b["type"] for b in result["biases"]]
        # Should detect at least one Tamil bias pattern
        assert len(result["biases"]) > 0
        assert any("சார்பு" in t or "Over" in t or "Confirmation" in t or "Sensationalism" in t for t in bias_types)

    def test_sinhala_bias_detection(self):
        result = analyze_perception("නිසැකවම සෑමවිටම මෙය අතිශය භයානක ව්‍යසනයක්.")
        bias_types = [b["type"] for b in result["biases"]]
        assert len(result["biases"]) > 0


class TestToneScoring:
    """Verify tone analytics produces valid scores."""

    def test_tones_are_present(self):
        result = analyze_perception("Therefore, we must absolutely collaborate to support this essential initiative.")
        assert len(result["tones"]) > 0

    def test_tone_has_required_fields(self):
        result = analyze_perception("This is a formal assessment document.")
        for tone in result["tones"]:
            assert "name" in tone
            assert "score" in tone
            assert "color" in tone
            assert isinstance(tone["score"], int)
            assert 0 <= tone["score"] <= 100

    def test_assertive_text_boosts_assertive_score(self):
        result = analyze_perception("We must definitely and absolutely demand essential action immediately.")
        tone_map = {t["name"]: t["score"] for t in result["tones"]}
        # Assertive tone should be elevated
        assert tone_map.get("Assertive", 0) > 30


class TestScoreCalculation:
    """Verify aggregate scores are computed correctly."""

    def test_scores_structure(self):
        result = analyze_perception("A neutral factual statement about market trends.")
        assert "sentiment" in result["scores"]
        assert "objectivity" in result["scores"]
        assert "biasIndex" in result["scores"]

    def test_biased_text_has_high_bias_index(self):
        result = analyze_perception("Obviously this shocking disaster proves everyone is always wrong.")
        assert result["scores"]["biasIndex"] > 50

    def test_neutral_text_has_low_bias_index(self):
        result = analyze_perception("The quarterly report shows stable growth across all sectors.")
        assert result["scores"]["biasIndex"] <= 50

    def test_objectivity_inverse_of_bias(self):
        result = analyze_perception("Some text for analysis.")
        assert result["scores"]["objectivity"] == max(0, 100 - result["scores"]["biasIndex"])


class TestEdgeCases:
    """Verify graceful handling of edge cases."""

    def test_single_word(self):
        result = analyze_perception("Hello")
        assert result["language"] in ["English", "Tamil", "Sinhala"]
        assert len(result["tones"]) > 0

    def test_very_long_text(self):
        long_text = "This is an obviously shocking disaster. " * 100
        result = analyze_perception(long_text)
        assert result["scores"]["biasIndex"] > 20
        # Quotes should be truncated to 150 chars
        for bias in result["biases"]:
            assert len(bias["quote"]) <= 150

    def test_special_characters(self):
        result = analyze_perception("Test with special chars: @#$%^&*()_+ 日本語 العربية")
        assert "language" in result
        assert "scores" in result

    def test_rephrase_suggestions_present(self):
        result = analyze_perception("Obviously this is always the case for everyone.")
        for bias in result["biases"]:
            if bias["type"] != "Objective Statement":
                assert bias["rephrase"] != ""
                assert bias["rephrase"] != bias["quote"]


class TestRephraser:
    """Test the rephraser module."""

    def test_english_rephrase(self):
        from rephraser import generate_alternatives
        result = generate_alternatives("This is an absolute disaster and completely unbelievable.", "en")
        assert "journalistic" in result
        assert "empathetic" in result
        assert "professional" in result
        # Should have replaced biased language
        assert "absolute disaster" not in result["journalistic"]

    def test_tamil_rephrase(self):
        from rephraser import generate_alternatives
        result = generate_alternatives("எப்போதுமே இது நிச்சயமாக நடக்கும்.", "ta")
        assert "journalistic" in result
        assert "empathetic" in result
        assert "professional" in result

    def test_sinhala_rephrase(self):
        from rephraser import generate_alternatives
        result = generate_alternatives("සෑමවිටම නිසැකවම මෙය සිදුවේ.", "si")
        assert "journalistic" in result
        assert "empathetic" in result
        assert "professional" in result


class TestDictionaryCompleteness:
    """Verify that all supported languages have matching dictionaries."""

    def test_all_languages_have_tone_dictionaries(self):
        for lang in ["en", "ta", "si"]:
            assert lang in TONE_DICTIONARIES, f"Missing tone dictionary for {lang}"
            assert len(TONE_DICTIONARIES[lang]) > 0

    def test_all_languages_have_bias_dictionaries(self):
        for lang in ["en", "ta", "si"]:
            assert lang in BIAS_DICTIONARIES, f"Missing bias dictionary for {lang}"
            assert len(BIAS_DICTIONARIES[lang]) > 0

    def test_english_has_six_bias_types(self):
        assert len(BIAS_DICTIONARIES["en"]) == 6

    def test_tamil_has_six_bias_types(self):
        assert len(BIAS_DICTIONARIES["ta"]) == 6

    def test_sinhala_has_six_bias_types(self):
        assert len(BIAS_DICTIONARIES["si"]) == 6
