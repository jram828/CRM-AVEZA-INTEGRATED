import useDrivePicker from 'react-google-drive-picker'
const GOOGLE_ID = import.meta.env.GOOGLE_ID;
const GOOGLE_API_KEY = import.meta.env.GOOGLE_API_KEY;

function GooglePicker() {
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