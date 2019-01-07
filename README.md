Tehsurfer/MPB
======
A Web viewer for viewing ECG data stored in Blackfynn on a fitted 3D model of the heart exported from Zinc

The purpose of this web viewer is to be able to explore data in a 3D shareable environment. Hopefully this will allow for conceptualisations of such data in browser.

View the latest online version at:
https://blackfynnpythonlink.ml/hoverGraph/MPB/

Devloper Installation
------
1. `git clone https://github.com/Tehsurfer/Data-Registration-Portal.git`
2. Install [Node.js](https://nodejs.org/en/) if you do not have it (check using `npm -v`)
3. Navigate to the /MPB directory and: 
```
npm install
npm run build
```
4. Open simple_heart/index.html in Firefox 

    OR
    
    Use `python -m http.server`
    
    Go to http://0.0.0.0:8000/simple_heart/index.html with Chrome
