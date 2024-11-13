import useDrivePicker from 'react-google-drive-picker'
const GOOGLE_ID = import.meta.env.VITE_GOOGLE_ID;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

function GooglePicker() {
  console.log('Google ID:', GOOGLE_ID)
  console.log('Google API Key:', GOOGLE_API_KEY)

  const [openPicker, authResponse] = useDrivePicker();  
  const handleOpenPicker = () => {
    openPicker({
      clientId: GOOGLE_ID,
      developerKey: GOOGLE_API_KEY,
      viewId: "DOCS",
      // token: token, // pass oauth token in case you already have one
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button')
        }
        console.log(data)
      },
    })
  }


  
  return (
    <div>
        <button onClick={() => handleOpenPicker()}>Open Picker</button>
    </div>
  );
}

export default GooglePicker;