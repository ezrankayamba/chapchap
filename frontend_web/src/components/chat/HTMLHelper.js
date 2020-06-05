const HTMLHelper = {
  createVideo: (peer) => {
    console.log(peer);
    const { uuid, name } = peer;
    let exist = document.getElementById(uuid);
    if (exist) return exist;
    let parts = uuid.split("-");
    let template = document.createElement("template");
    let html = `
          <div id="${uuid}" class="video-wrap">
              <p>${name}</p>
              <video></video>
          </div>
          `;
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
  },
};

export default HTMLHelper;
