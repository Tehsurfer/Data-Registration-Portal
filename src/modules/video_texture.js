var THREE = require('three');

//VideoTexture is used for creating and updating a video projected onto a Three.js texture
exports.VideoTexture = function()  {

	var _this = this;
	var video, displayScene, organsRenderer, videoTexture, vt, vp, playPromise, videoTest;
	var lastTime = 0;
	var lastUpdate = 0;
	var frameRate = 30;
	var videoPlaneLoadedFlag = false;
	_this.vt = undefined;
	_this.video = undefined;

	var initialise = function(){
	  	video = document.createElement( 'video' );
	  	video.src = "models/videos/heartBeatFullHD.mp4";
	  	video.load();
	  	video.loop = true;

		video.addEventListener('loadeddata', loadedVid);
	}

	//this.playAnimations plays both the video and model ( once video has loaded )
	this.playAnimations = function(flag){


		if ( flag === true ){

		  	playPromise = video.play();
		  	playPromise.then(_ => {

		        // playback has started so we can now play the model
		        organsRenderer.playAnimation = flag;
		    })
		    .catch(error => {

		        // Auto-play was prevented
		        console.log('error on playing: ' + error);
		    });
	  }
	  else{
	  	if ( playPromise !== undefined ){
	  		playPromise.then(_ => {

		        // playback has started so we can now pause
		        video.pause();
		        organsRenderer.playAnimation = flag;
		    })
		    .catch(error => {
		        // Auto-play was prevented
		        // Show paused UI.
		        console.log('paused before playing: ' + error);
		    });

	  	}
	  }
	}

	this.setDisplayScene = function(scene){
		displayScene = scene;
	}

	this.setOrgansRenderer = function(renderer){
		organsRenderer = renderer;
	}

	this.setPlayRate = function(value){
		if (video !== undefined && video.readyState >= 1){
			video.playbackRate = value*video.duration/3000;
		}
	}

	this.UpdateTimeFromSlider = function(sliderValue){
		if (organsRenderer.playAnimation === true){
			adjustVideoTime(sliderValue * 30);

			//check if video cannot play
			if ( video.readyState < 2 ){
				_this.playAnimations(false);
				videoTest = setTimeout(videoIsReady, 20);
			}
		}
	}

	this.updateTimeIfOff = function(currentTime){

		//Update our video if it is misaligned
    	if ( video !== undefined && videoTimeMisaligned(currentTime) ){
    		adjustVideoTime(currentTime);
    	}
	}

	var loadedVid = function(){
	  	if(video.readyState >= 1) {
		    _this.setPlayRate(3000/video.duration); //currently an issue
		    video.removeEventListener('loadeddata',loadedVid);
		    videoPlaneTest = setInterval(videoPlaneLoaded, 1000);
		}
	}

	// videoPlaneLoaded connects the video to the video texture once it has loaded
	var videoPlaneLoaded = function(){
	  	if (displayScene !== undefined && !videoPlaneLoadedFlag){
	  		if (displayScene.findGeometriesWithGroupName('Video plane').length >= 1){
	  			clearInterval(videoPlaneTest);
	  			connectVideoToTexture();
	  			videoPlaneLoadedFlag = true;
	  			organsRenderer.setPlayRate(3000/video.duration);
	  		}
	  	}
	}


	var createCanvasVideoTexture = function(){

		_this.video = video;
		var videoImage = document.createElement( 'canvas' );
		videoImage.width = 480;
		videoImage.height = 480;
		var videoImageContext = videoImage.getContext( '2d' );

		// background color if no video present
		videoImageContext.fillStyle = '#000000';
		videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

		videoTexture = new THREE.VideoTexture( video );
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;
		videoTexture.format = THREE.RGBFormat;
		_this.videoTexture = videoTexture;

		return videoTexture
	}

	var connectVideoToTexture = function(){

		vp = displayScene.findGeometriesWithGroupName('Video plane');

		//adjust our mesh to be in the correct position
		vp[0].geometry.rotateX(Math.PI/2);
		vp[0].geometry.rotateZ(Math.PI);
		vp[0].geometry.rotateZ(-.2);
		vp[0].geometry.scale(1.6,1.6,1.6);
		vp[0].geometry.translate(0,0,-.3);

		//get our video texture
		vt = createCanvasVideoTexture();

		//set the texture to the mesh
		var material = new THREE.MeshLambertMaterial({ map: vt});
		material.side = THREE.DoubleSide;
		vp[0].setMaterial(material);
	}

	// videoTimeMisaligned returns true if *currentTime* is more than .5% off the video time
	var videoTimeMisaligned = function(currentTime){

		currentUpdate = new Date().getTime();

		//define our variables for checking if it is worth updating the frame
		var not_updating_faster_than_framerate = Math.abs(currentUpdate - lastUpdate) > 1000*15/frameRate;
		var not_at_start_or_end_of_video = ( currentTime > 2 ) || ( currentTime < (3000-2) ) ;
		var model_off_by_more_than_10_frames = Math.abs(currentTime/3000*video.duration - video.currentTime ) > 20/frameRate

		if( not_updating_faster_than_framerate && not_at_start_or_end_of_video && model_off_by_more_than_10_frames){
        	lastTime = currentTime;
        	lastUpdate = currentUpdate;
        	return true;
	    }
	    return false;
	}

	var adjustVideoTime = function(time) {
	   	
	   	//we floor to the frame rate to try and grab the exact time of a frame
	    video.currentTime = Math.floor(time/3000 *video.duration * frameRate)/ frameRate
	    vt.needsUpdate = true;
	}

	var videoIsReadyToPlay = function(){

		// video.readyState 3 means we have data to load for the current time and foreseeable future
		if (video.readyState >= 3){
			_this.playAnimations(true);
			clearInterval(videoTest);
			return true;
		}else{
			return false;
		}
	}

	initialise();

}