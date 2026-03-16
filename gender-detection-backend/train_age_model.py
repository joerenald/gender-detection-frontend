import os
import cv2
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense

dataset_path = "model/UTKFace"

images = []
ages = []

print("Loading dataset...")

for file in os.listdir(dataset_path):

    try:
        age = int(file.split("_")[0])

        img_path = os.path.join(dataset_path, file)

        img = cv2.imread(img_path)

        if img is None:
            continue

        img = cv2.resize(img, (64,64))

        images.append(img)
        ages.append(age)

    except:
        continue


images = np.array(images) / 255.0
ages = np.array(ages)

print("Dataset Loaded:", images.shape)

model = Sequential()

model.add(Conv2D(32,(3,3),activation="relu",input_shape=(64,64,3)))
model.add(MaxPooling2D(2,2))

model.add(Conv2D(64,(3,3),activation="relu"))
model.add(MaxPooling2D(2,2))

model.add(Conv2D(128,(3,3),activation="relu"))
model.add(MaxPooling2D(2,2))

model.add(Flatten())

model.add(Dense(128,activation="relu"))

model.add(Dense(1))  # Age output

model.compile(
    optimizer="adam",
    loss="mse",
    metrics=["mae"]
)

print("Training model...")

model.fit(
    images,
    ages,
    epochs=10,
    batch_size=32,
    validation_split=0.2
)

model.save("model/age_model.keras")

print("Age Model Saved!")