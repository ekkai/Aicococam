/** 
 * @n [Get the module here](https://github.com/ekkai/aicococam)
 * @n Aicococam is an easy-to-use AI vision sensor with eight built-in functions: face recognition, digit recognition, mask recognition, object tracking, object recognition, line tracking, color recognition, and label (qr code) recognition.
 * Only one button is needed to complete the AI training, which can get rid of tedious training and complicated visual algorithm and help users stay focused on the conception and implementation of the project.
 * 
 * @copyright    MIT Lesser General Public License
 * 
 * @author [email](contents@kocoa.or.kr)
 * @date  2020-3-17
*/
enum Content1 {
    //% block="X center"
    xCenter = 1,
    //% block="Y center"
    yCenter = 2,
    //% block="width"
    width = 3,
    //% block="height"
    height = 4
}

enum Content2 {
    //% block="X beginning"
    xOrigin = 1,
    //% block="Y beginning"
    yOrigin = 2,
    //% block="X endpoint"
    xTarget = 3,
    //% block="Y endpoint"
    yTarget = 4
}

enum Content3 {
    //% block="ID"
    ID = 5,
    //% block="X center"
    xCenter = 1,
    //% block="Y center"
    yCenter = 2,
    //% block="width"
    width = 3,
    //% block="height"
    height = 4
}

enum Content4 {
    //% block="ID"
    ID = 5,
    //% block="X beginning"
    xOrigin = 1,
    //% block="Y beginning"
    yOrigin = 2,
    //% block="X endpoint"
    xTarget = 3,
    //% block="Y endpoint"
    yTarget = 4

}

enum COCOCAMResultType_t {
    //%block="frame"
    COCOCAMResultBlock = 1,
    //%block="arrow"
    COCOCAMResultArrow = 2,
}

let FIRST = {
    first: -1,
    xCenter: -1,
    xOrigin: -1,
    protocolSize: -1,
    algorithmType: -1,
    requestID: -1,
};

enum COCOCAMMode {
    //%block="save"
    SAVE,
    //%block="load"
    LOAD,
}
enum COCOCAMphoto {
    //%block="photo"
    PHOTO,
    //%block="screenshot"
    SCREENSHOT
}
enum protocolCommand {
    COMMAND_REQUEST = 0x20,
    COMMAND_REQUEST_BLOCKS = 0x21,
    COMMAND_REQUEST_ARROWS = 0x22,
    COMMAND_REQUEST_LEARNED = 0x23,
    COMMAND_REQUEST_BLOCKS_LEARNED = 0x24,
    COMMAND_REQUEST_ARROWS_LEARNED = 0x25,
    COMMAND_REQUEST_BY_ID = 0x26,
    COMMAND_REQUEST_BLOCKS_BY_ID = 0x27,
    COMMAND_REQUEST_ARROWS_BY_ID = 0x28,
    COMMAND_RETURN_INFO = 0x29,
    COMMAND_RETURN_BLOCK = 0x2A,
    COMMAND_RETURN_ARROW = 0x2B,
    COMMAND_REQUEST_KNOCK = 0x2C,
    COMMAND_REQUEST_ALGORITHM = 0x2D,
    COMMAND_RETURN_OK = 0x2E,
    COMMAND_REQUEST_LEARN = 0x2F,
    COMMAND_REQUEST_FORGET = 0x30,
    COMMAND_REQUEST_SENSOR = 0x31,

}

enum protocolAlgorithm {
    //%block="Face Recognition"
    ALGORITHM_FACE_RECOGNITION = 0,
    //%block="Object Tracking"
    ALGORITHM_OBJECT_TRACKING = 1,
    //%block="Object Recognition"
    ALGORITHM_OBJECT_RECOGNITION = 2,
    //%block="Line Tracking"
    ALGORITHM_LINE_TRACKING = 3,
    //%block="Color Recognition"
    ALGORITHM_COLOR_RECOGNITION = 4,
    //%block="Tag Recognition"
    ALGORITHM_TAG_RECOGNITION = 5,
    //%block="Object Classification"
    ALGORITHM_OBJECT_CLASSIFICATION = 6,
    //%block="Mask Recognition"
    ALGORITHM_MASK_RECOGNITION = 7,
    //%block="Digit Recognition"
    ALGORITHM_DIGIT_RECOGNITION = 8,
}


//% weight=100  color=#6373F5 icon="\uf06e"  block="Aicococam"
namespace aicococam {
    let protocolPtr: number[][] = [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0]]
    let Protocol_t: number[] = [0, 0, 0, 0, 0, 0]
    let i = 1;
    let FRAME_BUFFER_SIZE = 128
    let HEADER_0_INDEX = 0
    let HEADER_1_INDEX = 1
    let ADDRESS_INDEX = 2
    let CONTENT_SIZE_INDEX = 3
    let COMMAND_INDEX = 4
    let CONTENT_INDEX = 5
    let PROTOCOL_SIZE = 6
    let send_index = 0;
    let receive_index = 0;

    let COMMAND_REQUEST = 0x20;

    let receive_buffer: number[] = [];
    let send_buffer: number[] = [];
    let buffer: number[] = [];

    let send_fail = false;
    let receive_fail = false;
    let content_current = 0;
    let content_end = 0;
    let content_read_end = false;

    let command: number
    let content: number


    //% advanced=true shim=i2c::init
    function init(): void {
        return;
    }

    /**
     * 코코캠을 I2C통신으로 연결하여 사용합니다.
     */
    //%block="Aicococam initialize I2C until success"
    //% weight=90
    export function initI2c(): void {
        init();
        while (!readKnock());

        yes();
    }
    /**
     * 코코캠의 모드를 지정한 모드로 변경합니다.
     */
    //%block="Aicococam switch algorithm to %mode"
    //% weight=85
    export function initMode(mode: protocolAlgorithm) {
        writeAlgorithm(mode, protocolCommand.COMMAND_REQUEST_ALGORITHM)
        while (!wait(protocolCommand.COMMAND_RETURN_OK));
        yes();
    }
    /**
     * 코코캠에 저장되어 있는 데이터를 읽어옵니다.
     */
    //% block="Aicococam request data once and save into the result"
    //% weight=80
    export function request(): void {
        //for (let i = 0; i < 2; i++) {
            protocolWriteCommand(protocolCommand.COMMAND_REQUEST)
            processReturn();
        //}
    }
    /**
     * 코코캠화면에 인식된 프레임 중 학습된 결과의 개수를 읽어옵니다.
     */
    //%block="Aicococam get a total number of learned IDs from the result"
    //% weight=79
    export function getIds(): number {
        return Protocol_t[2];
    }
    /**
     * 코코캠에 학습된 박스나 화살표가 인식되면
     */
    //%block="Aicococam check if %Ht is on screen from the result"
    //% weight=78
    export function isAppear_s(Ht: COCOCAMResultType_t): boolean {
        switch (Ht) {
            case 1:
                return countBlocks_s() != 0 ? true : false;
            case 2:
                return countArrows_s() != 0 ? true : false;
            default:
                return false;
        }
    }
    /**
     * 코코캠의 화면 중앙과 가장 가까이 있는 박스의 데이터를 읽어옵니다.
     */
    //% block="Aicococam get %data of frame closest to the center of screen from the result"
    //% weight=77
    export function readBox_s(data: Content3): number {
        let coco_x
        let coco_y = readBlockCenterParameterDirect();
        if (coco_y != -1) {
            switch (data) {
                case 1:
                    coco_x = protocolPtr[coco_y][1]; break;
                case 2:
                    coco_x = protocolPtr[coco_y][2]; break;
                case 3:
                    coco_x = protocolPtr[coco_y][3]; break;
                case 4:
                    coco_x = protocolPtr[coco_y][4]; break;
                default:
                    coco_x = protocolPtr[coco_y][5];
            }
        }
        else coco_x = -1
        return coco_x;
    }
    /**
     * 지정한 ID가 코코캠에 학습되어 있는지의 여부를 판별합니다.
     * @param id to id ,eg: 1
     */
    //% block="Aicococam check if ID %id is learned from the result"
    //% weight=76
    export function isLearned(id: number): boolean {
        let coco_x = countLearnedIDs();
        if (id <= coco_x) return true;
        return false;
    }
    /**
     * 코코캠 화면에 지정한 ID의 프레임이 있는지 판별합니다.
     * @param id to id ,eg: 1
     */
    //% block="Aicococam check if ID %id frame is on screen from the result"
    //% weight=75
    export function isAppear(id: number): boolean {
                return countBlocks(id) != 0 ? true : false;
    }
    /**
     * 지정한 ID를 가진 박스의 정보를 읽어옵니다.
     * @param id to id ,eg: 1
     */
    //%block="Aicococam get $number1 of ID $id frame from the result"
    //% weight=65
    export function readeBox(id: number, number1: Content1): number {
        let coco_y = cycle_block(id, 1);
        let coco_x
        if (countBlocks(id) != 0) {
            if (coco_y != null) {
                switch (number1) {
                    case 1:
                        coco_x = protocolPtr[coco_y][1]; break;
                    case 2:
                        coco_x = protocolPtr[coco_y][2]; break;
                    case 3:
                        coco_x = protocolPtr[coco_y][3]; break;
                    case 4:
                        coco_x = protocolPtr[coco_y][4]; break;
                }
            }
            else coco_x = -1;
        }
        else coco_x = -1;
        return coco_x;
    }
    /**
    * 화살표의 정보를 읽어옵니다.
    * @param id to id ,eg: 1
    */

    //%block="Aicococam get $number1 arrow from the result"
    //% weight=60
    export function readeArrow(number1: Content2): number {
        let coco_y = cycle_arrow(1, 1);
        let coco_x
        if (countArrows(1) != 0) {
            if (coco_y != null) {

                switch (number1) {
                    case 1:
                        coco_x = protocolPtr[coco_y][1]; break;
                    case 2:
                        coco_x = protocolPtr[coco_y][2]; break;
                    case 3:
                        coco_x = protocolPtr[coco_y][3]; break;
                    case 4:
                        coco_x = protocolPtr[coco_y][4]; break;
                    default:
                        coco_x = -1;
                }
            }
            else coco_x = -1;
        }
        else coco_x = -1;
        return coco_x;
    }
    /**
     * 지정한 아이디로 자동학습니다.
     * @param id to id ,eg: 1
     */
    //%block="Aicococam learn ID %id once automatically"
    //% weight=30
    export function writeLearn1(id: number): void {
        writeAlgorithm(id, 0X36)
        //while(!wait(protocolCommand.COMMAND_RETURN_OK));
    }
    /**
     * 현재 선택한 모드에서 학습된 데이터를 전부 삭제합니다.
     */
    //%block="Aicococam forget all learning data of the current algorithm"
    //% weight=29
    export function forgetLearn(): void {
        writeAlgorithm(0x47, 0X37)
        //while(!wait(protocolCommand.COMMAND_RETURN_OK));
    }
    /**
     * 코코캠 화면에 텍스트를 출력합니다
     * @param name to name ,eg: "kocoafab"
     * @param x to x ,eg: 150
     * @param y to y ,eg: 30
     */
    //%block="Aicococam show custom texts %name at position x %x y %y on screen"
    //% weight=27
    //% x.min=0 x.max=320
    //% y.min=0 y.max=240
    export function writeOSD(name: string, x: number, y: number): void {
        //do{
        let buffer = cococam_protocol_write_begin(0x34);
        send_buffer[send_index] = name.length;
        if (x > 255) {
            send_buffer[send_index + 2] = (x % 255);
            send_buffer[send_index + 1] = 0xff;
        } else {
            send_buffer[send_index + 1] = 0;
            send_buffer[send_index + 2] = x;
        }
        send_buffer[send_index + 3] = y;
        send_index += 4;
        for (let i = 0; i < name.length; i++) {
            send_buffer[send_index] = name.charCodeAt(i);
            //serial.writeNumber(name.charCodeAt(i));
            send_index++;
        }
        let length = cococam_protocol_write_end();
        //serial.writeNumber(length)
        let Buffer = pins.createBufferFromArray(buffer);
        protocolWrite(Buffer);
        //}while(!wait(protocolCommand.COMMAND_RETURN_OK));
    }
    /**
     * 코코캠 화면에 출력된 텍스트를 전부 삭제합니다.
     */
    //%block="Aicococam clear all custom texts on screen"
    //% weight=26
    export function clearOSD(): void {
        writeAlgorithm(0x45, 0X35);
        //while(!wait(protocolCommand.COMMAND_RETURN_OK));
    }

    function validateCheckSum() {

        let stackSumIndex = receive_buffer[3] + CONTENT_INDEX;
        let coco_sum = 0;
        for (let i = 0; i < stackSumIndex; i++) {
            coco_sum += receive_buffer[i];
        }
        coco_sum = coco_sum & 0xff;

        return (coco_sum == receive_buffer[stackSumIndex]);
    }

    function cococam_protocol_write_end() {
        if (send_fail) { return 0; }
        if (send_index + 1 >= FRAME_BUFFER_SIZE) { return 0; }
        send_buffer[CONTENT_SIZE_INDEX] = send_index - CONTENT_INDEX;
        //serial.writeValue("618", send_buffer[CONTENT_SIZE_INDEX])
        let coco_sum = 0;
        for (let i = 0; i < send_index; i++) {
            coco_sum += send_buffer[i];
        }

        coco_sum = coco_sum & 0xff;
        send_buffer[send_index] = coco_sum;
        send_index++;
        return send_index;
    }

    function cococam_protocol_write_begin(command = 0) {
        send_fail = false;
        send_buffer[HEADER_0_INDEX] = 0x55;
        send_buffer[HEADER_1_INDEX] = 0xAA;
        send_buffer[ADDRESS_INDEX] = 0x11;
        //send_buffer[CONTENT_SIZE_INDEX] = datalen;
        send_buffer[COMMAND_INDEX] = command;
        send_index = CONTENT_INDEX;
        return send_buffer;
    }

    function protocolWrite(buffer: Buffer) {
        pins.i2cWriteBuffer(0x32, buffer, false);
        //basic.pause(50)
    }

    function processReturn() {
        if (!wait(protocolCommand.COMMAND_RETURN_INFO)) return false;
        protocolReadFiveInt16(protocolCommand.COMMAND_RETURN_INFO);
        for (let i = 0; i < Protocol_t[1]; i++) {

            if (!wait()) return false;
            if (protocolReadFiveInt161(i, protocolCommand.COMMAND_RETURN_BLOCK)) continue;
            else if (protocolReadFiveInt161(i, protocolCommand.COMMAND_RETURN_ARROW)) continue;
            else return false;
        }
        return true;
    }

    function wait(command = 0) {
        timerBegin();
        while (!timerAvailable()) {
            if (protocolAvailable()) {
                if (command) {
                    if (cococam_protocol_read_begin(command)) {
                        //serial.writeNumber(0);
                        return true;
                    }
                }
                else {
                    return true;
                }
            } else {
                return false;
            }
        }
        return false;
    }

    function cococam_protocol_read_begin(command = 0) {
        if (command == receive_buffer[COMMAND_INDEX]) {
            content_current = CONTENT_INDEX;
            content_read_end = false;
            receive_fail = false;
            return true;
        }
        return false;
    }

    let timeOutDuration = 100;
    let timeOutTimer: number
    function timerBegin() {
        timeOutTimer = input.runningTime();
    }

    function timerAvailable() {
        return (input.runningTime() - timeOutTimer > timeOutDuration);
    }

    let m_i = 16
    function protocolAvailable() {
        let buf = pins.createBuffer(16)
        if (m_i == 16) {
            buf = pins.i2cReadBuffer(0x32, 16, false);
            m_i = 0;
        }
        for (let i = m_i; i < 16; i++) {
            if (cococam_protocol_receive(buf[i])) {
                m_i++;
                return true;
            }
            m_i++;
        }
        return false
    }

    function cococam_protocol_receive(data: number): boolean {
        switch (receive_index) {
            case HEADER_0_INDEX:
                if (data != 0x55) { receive_index = 0; return false; }
                receive_buffer[HEADER_0_INDEX] = 0x55;
                break;
            case HEADER_1_INDEX:
                if (data != 0xAA) { receive_index = 0; return false; }
                receive_buffer[HEADER_1_INDEX] = 0xAA;
                break;
            case ADDRESS_INDEX:
                receive_buffer[ADDRESS_INDEX] = data;
                break;
            case CONTENT_SIZE_INDEX:
                if (data >= FRAME_BUFFER_SIZE - PROTOCOL_SIZE) { receive_index = 0; return false; }
                receive_buffer[CONTENT_SIZE_INDEX] = data;
                break;
            default:
                receive_buffer[receive_index] = data;

                if (receive_index == receive_buffer[CONTENT_SIZE_INDEX] + CONTENT_INDEX) {
                    content_end = receive_index;
                    receive_index = 0;
                    return validateCheckSum();

                }
                break;
        }
        receive_index++;
        return false;
    }

    function cococam_protocol_write_int16(content = 0) {

        let x: number = ((content.toString()).length)
        if (send_index + x >= FRAME_BUFFER_SIZE) { send_fail = true; return; }
        send_buffer[send_index] = content & 0xff;
        send_buffer[send_index + 1] = (content >> 8) & 0xff;
        send_index += 2;
    }

    function protocolReadFiveInt16(command = 0) {
        if (cococam_protocol_read_begin(command)) {
            Protocol_t[0] = command;
            Protocol_t[1] = cococam_protocol_read_int16();
            Protocol_t[2] = cococam_protocol_read_int16();
            Protocol_t[3] = cococam_protocol_read_int16();
            Protocol_t[4] = cococam_protocol_read_int16();
            Protocol_t[5] = cococam_protocol_read_int16();
            cococam_protocol_read_end();
            return true;
        }
        else {
            return false;
        }
    }

    function protocolReadFiveInt161(i: number, command = 0) {
        if (cococam_protocol_read_begin(command)) {
            protocolPtr[i][0] = command;
            protocolPtr[i][1] = cococam_protocol_read_int16();
            protocolPtr[i][2] = cococam_protocol_read_int16();
            protocolPtr[i][3] = cococam_protocol_read_int16();
            protocolPtr[i][4] = cococam_protocol_read_int16();
            protocolPtr[i][5] = cococam_protocol_read_int16();
            cococam_protocol_read_end();
            return true;
        }
        else {
            return false;
        }
    }

    function cococam_protocol_read_int16() {
        if (content_current >= content_end || content_read_end) { receive_fail = true; return 0; }
        let result = receive_buffer[content_current + 1] << 8 | receive_buffer[content_current];
        content_current += 2
        return result;
    }

    function cococam_protocol_read_end() {
        if (receive_fail) {
            receive_fail = false;
            return false;
        }
        return content_current == content_end;
    }

    function countLearnedIDs() {
        return Protocol_t[2]
    }

    function countBlocks(ID: number) {
        let counter = 0;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_BLOCK && protocolPtr[i][5] == ID) counter++;
        }
        return counter;
    }

    function countBlocks_s() {
        let counter = 0;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_BLOCK) counter++;
        }
        //serial.writeNumber(counter)
        return counter;
    }

    function countArrows(ID: number) {
        let counter = 0;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_ARROW && protocolPtr[i][5] == ID) counter++;
        }
        return counter;
    }

    function countArrows_s() {
        let counter = 0;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_ARROW) counter++;
        }
        return counter;
    }

    function readKnock() {
        for (let i = 0; i < 5; i++) {
            protocolWriteCommand(protocolCommand.COMMAND_REQUEST_KNOCK);//I2C
            if (wait(protocolCommand.COMMAND_RETURN_OK)) {
                return true;
            }
        }
        return false;
    }

    function writeForget() {
        for (let i = 0; i < 5; i++) {
            protocolWriteCommand(protocolCommand.COMMAND_REQUEST_FORGET);
            if (wait(protocolCommand.COMMAND_RETURN_OK)) {
                return true;
            }
        }
        return false;
    }

    function protocolWriteCommand(command = 0) {
        Protocol_t[0] = command;
        let buffer = cococam_protocol_write_begin(Protocol_t[0]);
        let length = cococam_protocol_write_end();
        let Buffer = pins.createBufferFromArray(buffer);
        protocolWrite(Buffer);
    }

    function protocolReadCommand(command = 0) {
        if (cococam_protocol_read_begin(command)) {
            Protocol_t[0] = command;
            cococam_protocol_read_end();
            return true;
        }
        else {
            return false;
        }
    }

    function writeAlgorithm(algorithmType: number, comemand = 0) {
        protocolWriteOneInt16(algorithmType, comemand);
        //return true//wait(protocolCommand.COMMAND_RETURN_OK);
        //while(!wait(protocolCommand.COMMAND_RETURN_OK));
        //return true
    }

    function writeLearn(algorithmType: number) {
        protocolWriteOneInt16(algorithmType, protocolCommand.COMMAND_REQUEST_LEARN);
        return wait(protocolCommand.COMMAND_RETURN_OK);
    }

    function protocolWriteOneInt16(algorithmType: number, command = 0) {
        let buffer = cococam_protocol_write_begin(command);
        cococam_protocol_write_int16(algorithmType);
        let length = cococam_protocol_write_end();
        let Buffer = pins.createBufferFromArray(buffer);
        protocolWrite(Buffer);
    }

    function cycle_block(ID: number, index = 1): number {
        let counter = 0;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_BLOCK && protocolPtr[i][5] == ID) {
                counter++;
                if (index == counter) return i;

            }
        }
        return null;
    }

    function cycle_arrow(ID: number, index = 1): number {
        let counter = 0;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_ARROW && protocolPtr[i][5] == ID) {
                counter++;
                if (index == counter) return i;

            }
        }
        return null;
    }

    function readBlockCenterParameterDirect(): number {
        let distanceMinIndex = -1;
        let distanceMin = 65535;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_BLOCK) {
                let distance = Math.round(Math.sqrt(Math.abs(protocolPtr[i][1] - 320 / 2))) + Math.round(Math.sqrt(Math.abs(protocolPtr[i][2] - 240 / 2)));
                if (distance < distanceMin) {
                    distanceMin = distance;
                    distanceMinIndex = i;
                }
            }
        }
        return distanceMinIndex
    }

    function readArrowCenterParameterDirect(): number {
        let distanceMinIndex = -1;
        let distanceMin = 65535;
        for (let i = 0; i < Protocol_t[1]; i++) {
            if (protocolPtr[i][0] == protocolCommand.COMMAND_RETURN_ARROW) {
                let distance = Math.round(Math.sqrt(Math.abs(protocolPtr[i][1] - 320 / 2))) + Math.round(Math.sqrt(Math.abs(protocolPtr[i][2] - 240 / 2)));
                if (distance < distanceMin) {
                    distanceMin = distance;
                    distanceMinIndex = i;
                }
            }
        }
        return distanceMinIndex
    }

    function no(): void {
        basic.showIcon(IconNames.No);
        basic.pause(100);
        basic.clearScreen();
        basic.pause(100);
    }
    function yes(): void {
        basic.showIcon(IconNames.Yes);
        basic.pause(100);
        basic.clearScreen();
    }


}
