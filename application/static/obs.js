import { Metacom } from './metacom.js';
import { OBS_ROOM, LOWERS_ROOM } from './consts.js';
import { ScreenComponent } from './lib/screen.component.js';

class Application {

  constructor() {
    const protocol = location.protocol === 'http:' ? 'ws' : 'wss';
    this.metacom = Metacom.create(`${protocol}://${location.host}/api`);

    this.screen = new ScreenComponent();
  }

  startBus() {
    api.bus.subscribe({ room: OBS_ROOM });
    api.bus.subscribe({ room: LOWERS_ROOM });
    api.bus.on('message', (data) => {
      switch (data.room) {
      case OBS_ROOM:
        this.screen.obsComment(data);
        break;

      case LOWERS_ROOM:
        this.screen.lowerThird(
          data.message.id,
          data.message.title,
          data.message.subtitle);
        break;
      }
    });
  }
}

window.addEventListener('load', async () => {
  window.application = new Application();
  window.api = window.application.metacom.api;

  await application.metacom.load('bus');
  application.startBus();

  if (window.obsstudio) {
    application.comment.displayComment('OBS is Running');
  } else {
    alert('This is page should be running under OBS');
    window.location.href = '/';
  }

});
