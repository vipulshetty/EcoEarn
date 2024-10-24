from flask import Blueprint, request, jsonify
from models.image_classifier import ImageClassifier

classify_bp = Blueprint('classify', __name__)
classifier = ImageClassifier()





@classify_bp.route('/classify', methods=['POST'])
def classify_image():
    if 'file' not in request.files:
        return jsonify(error='No file part'), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify(error='No selected file'), 400

    try:
        # Read the image file
        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

        # Use the classify_image method
        predicted_class = classifier.classify_image(img)

        return jsonify(prediction=predicted_class)

    except Exception as e:
        return jsonify(error=str(e)), 500
