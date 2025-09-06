// Virtual canvas dimensions
export const VIRTUAL_CANVAS_WIDTH = 508;
export const VIRTUAL_CANVAS_HEIGHT = 316;

// Thresholds for switching between different scaling strategies
export const VIRTUAL_CANVAS_X_THRESHOLD = 110;
export const DESK_OFFSET_X_THRESHOLD = 100;
export const SERVER_BOXES_OFFSET_X_THRESHOLD = 80;

// Maximum bitmask value for building windows
// Each bit is a window, either lit up (1) or not (0)
export const MAX_WINDOW_BITMASK = 0b1111;

// Maximum number of stars in the sky
export const MAX_STARS = 15;

// Delay in milliseconds for resize events
export const RESIZE_DELAY = 10;

// Maximum effective distance for the cursor to have any effect on an entity (in virtual px)
export const MAX_CURSOR_DISTANCE = 100;

// Text displayed on the PC
export const PC_TEXT = `
        
Touch me
(^_^)

Welcome
to my
personal
website!

Everything
here is
in 2D
(^_^)
`;

// Typing speed for the PC text (chars per second)
export const PC_TEXT_TYPING_SPEED = 15;

// Text displayed on the bottom server box
export const BOTTOM_SERVER_BOX_TEXT = "CV";

// Text displayed on the top server box
export const TOP_SERVER_BOX_TEXT = ["git", "hub"];
