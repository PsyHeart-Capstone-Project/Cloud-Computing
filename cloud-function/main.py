import os
import numpy as np
import librosa
import requests
import psycopg2
import gc
from google.cloud import storage
from pydub import AudioSegment
import json

# Konfigurasi database PostgreSQL dari environment variables
DB_HOST = os.environ['DB_HOST']
DB_NAME = os.environ['DB_NAME']
DB_USER = os.environ['DB_USER']
DB_PASSWORD = os.environ['DB_PASSWORD']

# Konfigurasi URL API model prediksi dari environment variables
PREDICT_API_URL = os.environ['PREDICT_API_URL']

def extract_features(file_path):
    try:
        y, sr = librosa.load(file_path)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=21)
        mfccs_mean = np.mean(mfccs, axis=1)
    except Exception as e:
        print(f"Error extracting features: {e}")
    return mfccs_mean

def get_bpm(file_path):
    try:
        audio = AudioSegment.from_file(file_path)
        samples = np.array(audio.get_array_of_samples(), dtype=np.float32)
        samples /= np.max(np.abs(samples))  # Normalize to range [-1, 1]
        tempo, _ = librosa.beat.beat_track(y=samples, sr=audio.frame_rate)
        del audio, samples  # Clean up memory
        gc.collect()  # Trigger garbage collection
        return tempo
    except Exception as e:
        print(f"Error calculating BPM: {e}")
        return None

def predict_category(features, bpm):
    try:
        features_list = features.tolist()  # Convert ndarray to list
        bpm_list = bpm.tolist()
        print(features_list)
        print(bpm_list)
        
        json_payload = {'input': features_list, 'bpm': bpm_list}
        json_string = json.dumps(json_payload)

        headers = {'Content-Type': 'application/json'}
        response = requests.post(PREDICT_API_URL, data=json_string, headers=headers)
        print(response)
        
        if response.status_code == 200:
            response_data = response.json()
            result = response_data.get('data', {}).get('result', {})
            genre = result.get('genre')
            category = result.get('category')
            print(f"Predicted genre: {genre}, category: {category}")  # Print the genre and category
            return genre, category
        else:
            print(f"Failed to predict category. Status code: {response.status_code}")
            return None, None
    
    except Exception as e:
        print(f"Error predicting category: {e}")
        return None, None

def save_to_db(url, name, artist, genre, category, duration_minutes_seconds):
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cur = conn.cursor()
        cur.execute("INSERT INTO songs (url, name, artist_name, genre, category_name, duration) VALUES (%s, %s, %s, %s, %s, %s)", (url, name, artist, genre, category, duration_minutes_seconds))
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error saving to database: {e}")

def delete_from_bucket(bucket_name, blob_name):
    try:
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        blob.delete()
    except Exception as e:
        print(f"Error deleting from bucket: {e}")

def parse_filename(blob_name):
    try:
        name_parts = blob_name.rsplit('/', 1)[-1].rsplit('.', 1)[0].split(' - ')
        artist = name_parts[0] if len(name_parts) > 1 else 'Unknown Artist'
        song = name_parts[1] if len(name_parts) > 1 else 'Unknown Song'
        return artist, song
    except Exception as e:
        print(f"Error parsing filename: {e}")
        return 'Unknown Artist', 'Unknown Song'

def process_file(bucket_name, blob_name):
    try:
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        
        # Get the direct download URL
        file_uri = blob.public_url
        
        temp_file = f"/tmp/{blob_name}"
        blob.download_to_filename(temp_file)
        
        features = extract_features(temp_file)
        bpm = get_bpm(temp_file)
        genre, category = predict_category(features, bpm)
        
        artist, song = parse_filename(blob_name)
        
        # Get the duration of the audio file in seconds
        audio = AudioSegment.from_file(temp_file)
        duration_seconds = len(audio) / 1000.0  # duration in seconds

        # Convert duration to minutes and seconds
        minutes, seconds = divmod(duration_seconds, 60)
        duration_minutes_seconds = "{:02}:{:02}".format(int(minutes), int(seconds))

        if category in ["Sleep", "Relax", "Anxiety", "Positive Energy", "Depression", "Motivation"]:
            save_to_db(file_uri, song, artist, genre, category, duration_minutes_seconds)
        else:
            delete_from_bucket(bucket_name, blob_name)

        # Clean up temporary file
        os.remove(temp_file)
        del features, bpm, genre, category, audio  # Clean up memory
        gc.collect()  # Trigger garbage collection
    
    except Exception as e:
        print(f"Error processing file: {e}")


def process_gcs_event(data, context):
    bucket_name = data['bucket']
    blob_name = data['name']
    process_file(bucket_name, blob_name)