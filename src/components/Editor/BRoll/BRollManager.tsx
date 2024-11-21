// Previous imports remain the same...

const handleRecordingComplete = useCallback((recordedBlob: Blob) => {
  const url = URL.createObjectURL(recordedBlob);
  
  // Create video element to get duration
  const video = document.createElement('video');
  video.src = url;
  
  video.onloadedmetadata = () => {
    const newClip: BRollClip = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Screen Recording ${new Date().toLocaleString()}`,
      duration: video.duration,
      thumbnail: url,
      url,
      type: 'video',
      startTime: 0,
      endTime: video.duration,
      volume: 1,
      opacity: 1,
      scale: 1,
      position: { x: 0, y: 0 },
      rotation: 0
    };

    setClips(prev => [...prev, newClip]);
    setSelectedClip(newClip.id);
    setPreviewUrl(url);

    // Show download dialog
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `recording-${Date.now()}.webm`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
}, []);

const stopScreenRecording = useCallback(() => {
  if (mediaRecorder && recordingStream) {
    mediaRecorder.stop();
    recordingStream.getTracks().forEach(track => track.stop());
    setMediaRecorder(null);
    setRecordingStream(null);
    setIsRecording(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Create blob from recorded chunks and handle the recording
    const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
    handleRecordingComplete(recordedBlob);
    setRecordedChunks([]);
  }
}, [mediaRecorder, recordingStream, recordedChunks, handleRecordingComplete]);

// Rest of the component remains the same...