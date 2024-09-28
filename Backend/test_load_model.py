from keras.models import load_model

try:
    model = load_model("model/plastic_waste_classifier.h5")
    print("Model loaded successfully!")
except Exception as e:
    print("Error loading model:", str(e))
