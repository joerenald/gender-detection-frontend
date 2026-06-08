import os
import cv2
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split

dataset_path = "model/UTKFace"

images = []
labels = []

print("Loading dataset...")

for file in os.listdir(dataset_path):

    try:
        race = int(file.split("_")[2])   # 👈 CHANGE HERE (race index)

        img_path = os.path.join(dataset_path, file)

        img = cv2.imread(img_path)

        if img is None:
            continue

        img = cv2.resize(img, (64, 64))

        images.append(img)
        labels.append(race)

    except:
        continue

X = np.array(images) / 255.0
y = np.array(labels)

print("Dataset loaded")
print("Images:", X.shape)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# CNN Model
model = tf.keras.Sequential([

    tf.keras.layers.Input(shape=(64, 64, 3)),

    tf.keras.layers.Conv2D(32, (3, 3), activation="relu"),
    tf.keras.layers.MaxPooling2D(),

    tf.keras.layers.Conv2D(64, (3, 3), activation="relu"),
    tf.keras.layers.MaxPooling2D(),

    tf.keras.layers.Conv2D(128, (3, 3), activation="relu"),
    tf.keras.layers.MaxPooling2D(),

    tf.keras.layers.Flatten(),

    tf.keras.layers.Dense(128, activation="relu"),

    tf.keras.layers.Dense(5, activation="softmax")  # 👈 5 classes for race
])

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

print("Training race model...")

model.fit(
    X_train,
    y_train,
    epochs=10,
    validation_data=(X_test, y_test)
)

model.save("race_model.keras")

print("Model saved as race_model.keras")