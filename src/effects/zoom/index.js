import { ENUM } from "../../constant";
import { ZoomConfig } from "../../config-interfaces";

const { ZOOM_ENUM } = ENUM;

class ZoomEffect {
  type = "";
  zoom = ZoomConfig;
  frameRate = 30;

  constructor(zoom, frameRate) {
    this.type = zoom.type;
    this.frameRate = frameRate;
    this.zoom = { ...ZoomConfig, ...zoom };
  }

  getConditionIn({ start = 0, end = 0, pzoom = 0.1, scale = 1, duration = 0 }) {
    return `between(time,${start},${end || duration}),zoom+${pzoom},1`;
  }

  getConditionOut({
    start = 0,
    end = 0,
    pzoom = 0.1,
    scale = 1,
    duration = 0,
  }) {
    if (start > 0 && end > 0) {
      return `lte(time,${start}),${scale},max(1.001,zoom-${pzoom})`;
    }

    if (start === 0 && end > 0) {
      return `lte(time,${end || 0}),${scale}-(time*${pzoom * 100}),1`;
    }

    return `between(time,0,0),${scale}, max(1.001,zoom-${pzoom})`;
  }

  complexFilter() {
    const { start, end, speed, scale } = this.zoom;
    const duration = Math.ceil(end - start);

    const zoomDuration = duration * frameRate;
    const pzoom = (scale * speed) / (frameRate * duration) / 100;

    const conditionIn = this.getConditionIn({ start, end, scale, pzoom });
    const conditionOut = this.getConditionOut({ start, end, scale, pzoom });

    const IN = `zoompan=z='if(${conditionIn})':d=${zoomDuration}`;
    const OUT = `zoompan=z='if(${conditionOut})':d=${zoomDuration}`;
    const ZOOM = this.type.toUpperCase().includes("OUT") ? OUT : IN;

    switch (this.type) {
      case ZOOM_ENUM.IN:
      case ZOOM_ENUM.OUT: {
        return `${ZOOM}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`;
      }

      //TODO --test--
      case ZOOM_ENUM.OUT_PAN_UP:
      case ZOOM_ENUM.IN_PAN_UP: {
        return `${ZOOM}:x='iw/2-(iw/zoom)/2'`;
      }

      case ZOOM_ENUM.OUT_PAN_DOWN:
      case ZOOM_ENUM.IN_PAN_DOWN: {
        return `${ZOOM}:y='ih/2-(ih/zoom/2)'`;
      }

      case ZOOM_ENUM.IN_PAN_TOP_LEFT:
      case ZOOM_ENUM.OUT_PAN_TOP_LEFT: {
        return `${ZOOM}:x=0:y=0`;
      }

      case ZOOM_ENUM.IN_PAN_TOP_RIGHT:
      case ZOOM_ENUM.OUT_PAN_TOP_RIGHT: {
        return `${ZOOM}:x=iw-(iw/zoom):y=0`;
      }

      case ZOOM_ENUM.IN_PAN_BOTTOM_LEFT:
      case ZOOM_ENUM.OUT_PAN_BOTTOM_LEFT: {
        return `${ZOOM}:x=0:y=ih-(ih/zoom)`;
      }

      case ZOOM_ENUM.IN_PAN_BOTTOM_RIGHT:
      case ZOOM_ENUM.OUT_PAN_BOTTOM_RIGHT: {
        return `${ZOOM}:x=iw-(iw/zoom):y=ih-(ih/zoom)`;
      }

      default: {
        return `${ZOOM}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`;
      }
    }
  }

  getZoomComplexFilter() {
    return this.complexFilter();
  }
}

const ZoomEffectInstance = new ZoomEffect();
export { ZoomEffect as ZoomEffectClass, ZoomEffectInstance as ZoomEffect };
