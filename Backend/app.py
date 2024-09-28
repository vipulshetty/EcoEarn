from flask import Flask, request, jsonify
import cv2
import numpy as np
import tensorflow as tf

app = Flask(__name__)

# Load the MobileNetV2 model
model = tf.keras.applications.MobileNetV2(weights='imagenet')

@app.route('/classify', methods=['POST'])
def classify_image():
    if 'file' not in request.files:
        return jsonify(error='No file part'), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify(error='No selected file'), 400

    try:
        # Read the image from the file stream
        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

        # Preprocess the image for classification
        img_resized = cv2.resize(img, (224, 224))
        img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_resized)
        img_array = np.expand_dims(img_array, axis=0)

        # Perform classification
        predictions = model.predict(img_array)
        predicted_class_index = np.argmax(predictions[0])

        # Decode predictions (for ImageNet)
        decoded_predictions = tf.keras.applications.mobilenet_v2.decode_predictions(predictions, top=1)
        predicted_class = decoded_predictions[0][0][1]

        return jsonify(predicted_class=predicted_class)

    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
