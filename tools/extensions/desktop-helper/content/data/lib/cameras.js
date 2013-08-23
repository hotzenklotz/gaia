!function() {

  var CameraManager = {

    // The camera stream
    stream: false,

    capabilities: {
      focusModes: '',
      pictureSizes: [{
        width: 600,
        height: 600
      }],
      previewSizes: [{
        width: 600,
        height: 600
      }],
      recorderProfiles: {
        cif: {
          video: {
            width: 600,
            height: 600
          }
        }
      }
    },

    getListOfCameras: function() {
      console.log('mozCamera.getListOfCameras');
      return [this];
    },

    /**
     * Gets a camera
     */
    getCamera: function(options, callback) {
      console.log('mozCamera.getCamera');

      var pictureSizes = this.capabilities.pictureSizes[0];

      navigator.mozGetUserMedia({video: true},
        function(stream) {
          this.stream = stream;

          //update the camera's capabilities to use its real resolution
          setPictureSize = function(e) {
            pictureSizes.width = video.videoWidth;
            pictureSizes.height = video.videoHeight;
            console.log(e, video.videoWidth); // ############################# remove
            video.pause();
          }

          var video = document.createElement('video');
          // video.addEventListener('loadeddata', setPictureSize, false); //################ remove
          // video.addEventListener('loadedmetadata', setPictureSize, false);
          // video.addEventListener('canplay', setPictureSize, false);
          // video.addEventListener('play', setPictureSize, false);
          video.addEventListener('playing', setPictureSize, false);

          video.src = window.URL.createObjectURL(stream);
          video.play();

          callback(this);
          this.onPreviewStateChange('started');
        }.bind(this),
        function() {
          console.log('Could not initialize camera.');
        }
      );
    },

    getPreviewStream: function(config, callback) {
      console.log('mozCamera.getPreviewStream');
      callback(this.stream);
    },

    getPreviewStreamVideoMode: function(config, callback) {
      console.log('mozCamera.getPreviewStreamVideoMode');
      callback(this.stream);
    },

    resumePreview: function() {
      console.log('mozCamera.resumePreview');
    },

    autoFocus: function() {
      console.log('mozCamera.autoFocus');
    },

    takePicture: function(config, onSuccess, onError) {
      console.log('mozCamera.takePicture');
      var cnvs = document.createElement('canvas');

      cnvs.width = config.pictureSize.width;
      cnvs.height = config.pictureSize.height;
      var ctx = cnvs.getContext('2d');
      ctx.drawImage(window.document.querySelector('video'), 0, 0, cnvs.width, cnvs.height);
      cnvs.toBlob(function(blob) {
          onSuccess(blob);
      }, 'image/jpeg');
    },

    release: function() {
      console.log('mozCamera.release');
    }
  };

  FFOS_RUNTIME.makeNavigatorShim('mozCameras', CameraManager);
}();
