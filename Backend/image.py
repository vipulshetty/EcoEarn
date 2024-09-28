from flask import Flask, request, jsonify
import cv2
import numpy as np
import tensorflow as tf
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads/"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load MobileNetV2 pre-trained on ImageNet
model = tf.keras.applications.MobileNetV2(weights='imagenet')

def assess_quality(image):
    # Convert image to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Calculate mean intensity
    mean_intensity = np.mean(gray_image)
    # Determine quality based on mean intensity and size
    height, width, _ = image.shape
    size_quality = ""
    intensity_quality = ""
    # Size-based quality
    if height > 200 and width > 200:
        size_quality = "Good Size"
    elif 100 < height <= 200 and 100 < width <= 200:
        size_quality = "Average Size"
    else:
        size_quality = "Poor Size"
    # Intensity-based quality
    if mean_intensity > 200:
        intensity_quality = "Clear"
    elif 100 < mean_intensity <= 200:
        intensity_quality = "Slightly Clear"
    else:
        intensity_quality = "Opaque"
    return size_quality, intensity_quality

@app.route('/classify', methods=['POST'])
def classify_image():
    if 'files' not in request.files:
        return jsonify({'error': 'No files part'}), 400
    
    files = request.files.getlist('files')
    
    if len(files) == 0:
        return jsonify({'error': 'No files selected'}), 400
    
    results = []
    
    for file in files:
        if file.filename == '':
            return jsonify({'error': 'One of the files has no selected filename'}), 400
        
        # Save the file to the upload folder
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        
        # Read the image for prediction and quality assessment
        img = cv2.imread(filepath)
        
        # Assess the quality of the image
        size_quality, intensity_quality = assess_quality(img)
        
        # Preprocess the image for classification
        img_resized = cv2.resize(img, (224, 224))
        img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_resized)
        img_array = np.expand_dims(img_array, axis=0)
        
        # Perform prediction
        predictions = model.predict(img_array)
        decoded_predictions = tf.keras.applications.mobilenet_v2.decode_predictions(predictions, top=1)
        predicted_class = decoded_predictions[0][0][1]
        confidence_score = float(decoded_predictions[0][0][2])
        
        results.append({
            'label': predicted_class,
            'confidence': confidence_score,
            'size_quality': size_quality,
            'intensity_quality': intensity_quality,
            'filename': file.filename
        })
    
    return jsonify({'results': results}), 200

if __name__ == '__main__':
    app.run(debug=True)