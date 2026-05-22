import spacy
try:
    spacy.cli.download("en_core_web_sm")
    print("Successfully downloaded en_core_web_sm")
except Exception as e:
    print(f"Error downloading: {e}")
