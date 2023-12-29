export function handlePaste(view, event, slice) {
  const items = Array.from(event.clipboardData?.items || []);
  for (const item of items) {
    if (item.type.indexOf('image') === 0) {
      let filesize = (item.size / 1024 / 1024).toFixed(4); // get the filesize in MB
      if (filesize < 10) {
        // check image under 10MB
        // check the dimensions
        let _URL = window.URL || window.webkitURL;
        let img = new Image(); /* global Image */
        img.src = _URL.createObjectURL(item);
        img.onload = function () {
          if (this.width > 5000 || this.height > 5000) {
            window.alert(
              'Your images need to be less than 5000 pixels in height and width.'
            ); // display alert
          } else {
            // valid image so upload to server
            // uploadImage will be your function to upload the image to the server or s3 bucket somewhere
            uploadImage(file)
              .then(function (response) {
                // response is the image url for where it has been saved
                // place the now uploaded image in the editor where it was pasted
                const node = schema.nodes.image.create({
                  src: response,
                }); // creates the image element
                const transaction =
                  view.state.tr.replaceSelectionWith(node); // places it in the correct position
                view.dispatch(transaction);
              })
              .catch(function (error) {
                if (error) {
                  window.alert(
                    'There was a problem uploading your image, please try again.'
                  );
                }
              });
          }
        };
      } else {
        window.alert('Images need to be less than 10mb in size.');
      }
      return true; // handled
    }
  }
  return false; // not handled use default behaviour
}