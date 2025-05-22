import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Camera } from 'expo-camera';

const CameraView = ({ onClose, onCapture }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [captureMode, setCaptureMode] = useState('front'); // 'front' or 'back'
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (captureMode === 'front') {
          setFrontImage(photo.uri);
          setCaptureMode('back');
        } else {
          setBackImage(photo.uri);
          // Both images captured, call onCapture
          onCapture({ front: frontImage, back: photo.uri });
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  if (hasPermission === null) {
    return <View style={styles.cameraContainer}><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.cameraContainer}><Text>No access to camera. Please enable camera permissions.</Text></View>;
  }

  return (
    <View style={styles.cameraContainer}>
      <View style={styles.cameraHeader}>
        <Text style={styles.cameraTitle}>
          {captureMode === 'front' ? 'Take Front Picture' : 'Take Back Picture'}
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      {frontImage && captureMode === 'back' ? (
        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Front Image Preview:</Text>
          <Image source={{ uri: frontImage }} style={styles.imagePreview} />
        </View>
      ) : null}
      
      <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={cameraRef}>
        <View style={styles.cameraOverlay}>
          <View style={styles.cardOutline} />
        </View>
      </Camera>
      
      <View style={styles.cameraControls}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        
        <Text style={styles.captureInstructions}>
          {captureMode === 'front' 
            ? 'Position the FRONT of your gift card in the frame' 
            : 'Now position the BACK of your gift card'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  cameraTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardOutline: {
    width: 280,
    height: 180,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  cameraControls: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  captureButtonInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'white',
  },
  captureInstructions: {
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  previewContainer: {
    position: 'absolute',
    top: 70,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    padding: 8,
    width: 120,
  },
  previewLabel: {
    color: 'white',
    fontSize: 12,
    marginBottom: 4,
  },
  imagePreview: {
    width: 104,
    height: 70,
    borderRadius: 4,
  },
});

export default CameraView;
