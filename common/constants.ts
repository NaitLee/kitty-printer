
export const DEF_CANVAS_WIDTH = 384;
export const DEF_CANVAS_HEIGHT = DEF_CANVAS_WIDTH;
export const INL_ICON_SIZE = 24;
export const CAT_ADV_SRV = 0xaf30;
export const CAT_PRINT_SRV = 0xae30;
export const CAT_PRINT_TX_CHAR = 0xae01;
export const CAT_PRINT_RX_CHAR = 0xae02;

export const IN_TO_CM = 2.54;
export const DEF_DPI = 384 / (4.8 / IN_TO_CM);
export const DEF_FINISH_FEED = 100;
export const FINISH_FEED_RANGE = [0, 50, 100];
export const DEF_SPEED = 32;
export const SPEED_RANGE = {
    'speed^quick': 8,
    'speed^fast': 16,
    'speed^normal': 32
};
export const DEF_ENERGY = 24000;
export const ENERGY_RANGE = {
    'strength^low': 12000,
    'strength^medium': 24000,
    'strength^high': 48000
};

export const STATICDIR = 'static'
export const LANGDIR = 'lang';
export const LANGDB = 'languages.json';
export const DEF_LANG = 'en-US';
export const STUFF_STOREKEY = 'stuffs';
export const INL_ICON_COLOR = 'currentColor';
export const DEF_PIC_URL = 'kitty.svg';
export const STUFF_PAINT_INIT_URL = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"></svg>';
export const JSLICENSE_MAIN_URL = 'https://www.gnu.org/licenses/agpl-3.0.html';
export const JSLICENSE_MAIN_NAME = 'AGPL-3.0';
export const JSLICENSE_MAIN_REPO = 'https://github.com/NaitLee/kitty-printer';
