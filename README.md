NEW FEATURES: 
- Working 'Today's Summary' and 'Recent Events' Log. CSV now updates with eye_tracker.py.
- Working Chrome notifications
- Original features still working, i.e. chrome extension, eye tracker, live focus status


FEATURES THAT NEED TO BE FIXED IN FUTURE:
- nicer logo/design touches
- fix drifting textboxes on side not priority but theyre annoying 
- reward system in Today Summary (ur focused for X minutes)
- reward system in notification for every 30 mins or something (good job U focused for X minutes!)
- make sure it doesnt say "you switched tabs" when you switch to a focus site -- make it say nothing for that
- Give a distracted notification if eyes away or face not detected

installation instructions--

terminal : 

cd Desktop/filename  
python3 -m venv venv  
source venv/bin/activate  
pip install -r requirements.txt  
python3 app/server.py            
- server runs at http://127.0.0.1:5000/



In a separate terminal but under the venv, run the eye tracker: python3 eye_tracker.py USERNAME   
- This opens a webcam window; press 'q' to quit.
- remember to include username, i.e. 'Alaina' or it will default to default_user and eye_tracker data will not record to CSV


Other troubleshooting:
  - On macOS give permissions to Chrome for notifications + make sure Focus/DnD is off
