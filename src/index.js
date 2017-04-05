import FileSaver from 'file-saver'

document.getElementById('cap').addEventListener('click', () => {
  chrome.tabs.captureVisibleTab(null, { format: "jpeg" }, function(hoge) {
    const block = hoge.split(";")
    const mimeType = block[0].split(":")[1] // In this case "image/jpg"
    const realData = block[1].split(",")[1] // For example:  iVBORw0KGgouqw23....
    const canvasBlob = b64toBlob(realData, mimeType)

    const fd = new FormData(document.getElementById('upload-form'))
    fd.append('photo', canvasBlob)
    fetch('http://localhost:3000/page/api/upload/', {
      method: 'POST',
      body: fd
    })

    //FileSaver.saveAs(canvasBlob, "screenshot.jpg")
  })
})

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || ''
  sliceSize = sliceSize || 512

  const byteCharacters = atob(b64Data)
  let byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)
    let byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, {
    type: contentType
  })
  return blob
}