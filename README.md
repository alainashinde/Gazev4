NEW FEATURES: 
- Working 'Today's Summary' and 'Recent Events' Log. CSV now updates with eye_tracker.py.
- Original features still working, i.e. chrome extension, eye tracker, live focus status

installation instructions--

terminal : 

cd/desktop/filename  
python -m venv venv  
source venv/bin/activate  
pip install -r requirements.txt  
python3 app/server.py            
- server runs at http://127.0.0.1:5000/



In a separate terminal but under the venv, run the eye tracker: python3 eye_tracker.py USERNAME   
- This opens a webcam window; press 'q' to quit.
- remember to include username, i.e. 'Alaina' or it will default to default_user and eye_tracker data will not record to CSV
