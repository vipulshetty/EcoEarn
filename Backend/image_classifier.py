import cv2
import numpy as np
import tensorflow as tf

class ImageClassifier:
    def __init__(self):
        # Load MobileNetV2 pre-trained on ImageNet
        self.model = tf.keras.applications.MobileNetV2(weights='imagenet')
        
        # Class labels for plastic waste types (these are for demonstration; use your own if you have custom labels)
        self.class_labels = ['PET', 'HDPE', 'LDPE', 'PP', 'PS', 'Other']

    def classify_image(self, img_path):
        # Read and preprocess the image
        img = cv2.imread(img_path)
        img_resized = cv2.resize(img, (224, 224))  # Resize to model input size
        img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_resized)
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

        # Perform classification
        predictions = self.model.predict(img_array)
        predicted_class_index = np.argmax(predictions[0])  # Get the index of the highest probability
        
        # Decode the predictions to get readable labels (for ImageNet)
        decoded_predictions = tf.keras.applications.mobilenet_v2.decode_predictions(predictions, top=1)
        predicted_class = decoded_predictions[0][0][1]  # Get the class name

        return predicted_class

    def display_image_with_prediction(self, img_path, predicted_class):
        # Read the image again to display
        img = cv2.imread(img_path)
        
        # Display the result on the image
        font_scale = 2
        font = cv2.FONT_HERSHEY_PLAIN
        cv2.putText(img, predicted_class, (10, 30), font, font_scale, (255, 0, 0), 2)

        # Show the image
        cv2.imshow("Classified Image", img)
        cv2.waitKey(0)  # Wait for a key press
        cv2.destroyAllWindows()
