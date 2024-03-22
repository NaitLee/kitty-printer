
// No rights reserved to this file

const crc8_table = [
    0x00, 0x07, 0x0e, 0x09, 0x1c, 0x1b, 0x12, 0x15, 0x38, 0x3f, 0x36, 0x31,
    0x24, 0x23, 0x2a, 0x2d, 0x70, 0x77, 0x7e, 0x79, 0x6c, 0x6b, 0x62, 0x65,
    0x48, 0x4f, 0x46, 0x41, 0x54, 0x53, 0x5a, 0x5d, 0xe0, 0xe7, 0xee, 0xe9,
    0xfc, 0xfb, 0xf2, 0xf5, 0xd8, 0xdf, 0xd6, 0xd1, 0xc4, 0xc3, 0xca, 0xcd,
    0x90, 0x97, 0x9e, 0x99, 0x8c, 0x8b, 0x82, 0x85, 0xa8, 0xaf, 0xa6, 0xa1,
    0xb4, 0xb3, 0xba, 0xbd, 0xc7, 0xc0, 0xc9, 0xce, 0xdb, 0xdc, 0xd5, 0xd2,
    0xff, 0xf8, 0xf1, 0xf6, 0xe3, 0xe4, 0xed, 0xea, 0xb7, 0xb0, 0xb9, 0xbe,
    0xab, 0xac, 0xa5, 0xa2, 0x8f, 0x88, 0x81, 0x86, 0x93, 0x94, 0x9d, 0x9a,
    0x27, 0x20, 0x29, 0x2e, 0x3b, 0x3c, 0x35, 0x32, 0x1f, 0x18, 0x11, 0x16,
    0x03, 0x04, 0x0d, 0x0a, 0x57, 0x50, 0x59, 0x5e, 0x4b, 0x4c, 0x45, 0x42,
    0x6f, 0x68, 0x61, 0x66, 0x73, 0x74, 0x7d, 0x7a, 0x89, 0x8e, 0x87, 0x80,
    0x95, 0x92, 0x9b, 0x9c, 0xb1, 0xb6, 0xbf, 0xb8, 0xad, 0xaa, 0xa3, 0xa4,
    0xf9, 0xfe, 0xf7, 0xf0, 0xe5, 0xe2, 0xeb, 0xec, 0xc1, 0xc6, 0xcf, 0xc8,
    0xdd, 0xda, 0xd3, 0xd4, 0x69, 0x6e, 0x67, 0x60, 0x75, 0x72, 0x7b, 0x7c,
    0x51, 0x56, 0x5f, 0x58, 0x4d, 0x4a, 0x43, 0x44, 0x19, 0x1e, 0x17, 0x10,
    0x05, 0x02, 0x0b, 0x0c, 0x21, 0x26, 0x2f, 0x28, 0x3d, 0x3a, 0x33, 0x34,
    0x4e, 0x49, 0x40, 0x47, 0x52, 0x55, 0x5c, 0x5b, 0x76, 0x71, 0x78, 0x7f,
    0x6a, 0x6d, 0x64, 0x63, 0x3e, 0x39, 0x30, 0x37, 0x22, 0x25, 0x2c, 0x2b,
    0x06, 0x01, 0x08, 0x0f, 0x1a, 0x1d, 0x14, 0x13, 0xae, 0xa9, 0xa0, 0xa7,
    0xb2, 0xb5, 0xbc, 0xbb, 0x96, 0x91, 0x98, 0x9f, 0x8a, 0x8d, 0x84, 0x83,
    0xde, 0xd9, 0xd0, 0xd7, 0xc2, 0xc5, 0xcc, 0xcb, 0xe6, 0xe1, 0xe8, 0xef,
    0xfa, 0xfd, 0xf4, 0xf3
];


function crc8(data: Uint8Array) {
    let crc = 0;
    for (const byte of data)
        crc = crc8_table[(crc ^ byte) & 0xff];
    return crc & 0xff;
}

function reverseBits(i: number) {
    i = ((i & 0b10101010) >> 1) | ((i & 0b01010101) << 1);
    i = ((i & 0b11001100) >> 2) | ((i & 0b00110011) << 2);
    return ((i & 0b11110000) >> 4) | ((i & 0b00001111) << 4);
}

function bytes(i: number, length?: number, big_endian?: boolean) {
    length = length || 1;
    const result = new Uint8Array(length);
    let p = 0;
    while (i !== 0) {
        result[p] = i & 0xff;
        i >>= 8;
        ++p;
    }
    if (big_endian)
        result.reverse();
    return result;
}

function delay(msecs: number) {
    return new Promise<void>(resolve => setTimeout(() => resolve(), msecs));
}

export enum Command {
    ApplyEnergy = 0xbe,
    GetDeviceState = 0xa3,
    GetDeviceInfo = 0xa8,
    UpdateDevice = 0xa9,
    SetDpi = 0xa4,
    Lattice = 0xa6,
    Retract = 0xa0,
    Feed = 0xa1,
    Speed = 0xbd,
    Energy = 0xaf,
    Bitmap = 0xa2,
}

export enum CommandType {
    Transfer = 0,
    Response = 1,
}

export interface PrinterState {
    out_of_paper: number;
    cover: number;
    overheat: number;
    low_power: number;
    pause: number;
    busy: number;
}

export enum StateFlag {
    out_of_paper = 1 << 0,
    cover = 1 << 1,
    overheat = 1 << 2,
    low_power = 1 << 3,
    pause = 1 << 4,
    busy = 0x80,
}

export class CatPrinter {

    pause = new Uint8Array([0x51, 0x78, 0xa3, 0x01, 0x01, 0x00, 0x10, 0x70, 0xff]);
    resume = new Uint8Array([0x51, 0x78, 0xa3, 0x01, 0x01, 0x00, 0x00, 0x00, 0xff]);
    mtu = 200;
    buffer = new Uint8Array(this.mtu);
    bufferSize = 0;
    state: PrinterState;

    constructor(
            public model: string,
            public write: (command: Uint8Array) => Promise<void>,
            public dry_run?: boolean) {
        this.state = {
            out_of_paper: 0,
            cover: 0,
            overheat: 0,
            low_power: 0,
            pause: 0,
            busy: 0
        };
    }

    notify = (message: Uint8Array) => {
        const state = message[6];
        this.state = {
            out_of_paper: state & StateFlag.out_of_paper,
            cover: state & StateFlag.cover,
            overheat: state & StateFlag.overheat,
            low_power: state & StateFlag.low_power,
            pause: state & StateFlag.pause,
            busy: state & StateFlag.busy
        };
    }

    isNewModel() {
        return this.model === 'GB03' || this.model.startsWith('MX');
    }

    compressOk() {
        return this.isNewModel();
    }

    make(command: Command, payload: Uint8Array, type: CommandType = CommandType.Transfer) {
        return new Uint8Array([
            0x51, 0x78, command, type,
            payload.length & 0xff, payload.length >> 8,
            ...payload, crc8(payload), 0xff
        ]);
    }

    pend(data: Uint8Array) {
        for (let i = 0; i < data.length; ++i)
            this.buffer[this.bufferSize++] = data[i];
    }

    async flush() {
        while (this.state.pause)
            await delay(100);
        if (this.bufferSize === 0)
            return;
        await this.write(this.buffer.slice(0, this.bufferSize));
        this.bufferSize = 0;
        await delay(20);
        return;
    }

    async send(data: Uint8Array) {
        if (this.bufferSize + data.length > this.mtu)
            await this.flush();
        this.pend(data);
        return;
    }

    draw(line: Uint8Array) {
        // TODO: if (this.compressOk())
        return this.send(this.make(Command.Bitmap, line));
    }

    drawPbm(line: Uint8Array) {
        return this.draw(line.map(reverseBits));
    }

    applyEnergy() {
        return this.send(this.make(Command.ApplyEnergy, bytes(0x01)));
    }

    getDeviceState() {
        return this.send(this.make(Command.GetDeviceState, bytes(0x00)));
    }

    getDeviceInfo() {
        return this.send(this.make(Command.GetDeviceInfo, bytes(0x00)));
    }

    updateDevice() {
        return this.send(this.make(Command.UpdateDevice, bytes(0x00)));
    }

    setDpi(_dpi = 200) {
        return this.send(this.make(Command.SetDpi, bytes(50)));
    }

    startLattice() {
        return this.send(this.make(Command.Lattice, new Uint8Array([0xaa, 0x55, 0x17, 0x38, 0x44, 0x5f, 0x5f, 0x5f, 0x44, 0x38, 0x2c])));
    }

    endLattice() {
        return this.send(this.make(Command.Lattice, new Uint8Array([0xaa, 0x55, 0x17, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x17])));
    }

    retract(points: number) {
        return this.send(this.make(Command.Retract, bytes(points, 2)));
    }

    feed(points: number) {
        return this.send(this.make(Command.Feed, bytes(points, 2)));
    }

    setSpeed(value: number) {
        return this.send(this.make(Command.Speed, bytes(value)));
    }

    setEnergy(value: number) {
        return this.send(this.make(Command.Energy, bytes(value, 2)));
    }

    prepareCamera() {
        // try to make a camera model work
        return this.send(new Uint8Array([0x51, 0x78, 0xbc, 0x00, 0x01, 0x02, 0x01, 0x2d, 0xff]));
    }

    async prepare(speed: number, energy: number) {
        await this.flush();
        await this.getDeviceState();
        await this.prepareCamera();
        await this.setDpi();
        await this.setSpeed(speed);
        await this.setEnergy(energy);
        await this.applyEnergy();
        await this.updateDevice();
        await this.startLattice();
        await this.flush();
    }

    async finish(extra_feed: number) {
        await this.flush();
        await this.endLattice();
        await this.setSpeed(8);
        await this.feed(extra_feed);
        await this.getDeviceState();
        await this.flush();
    }

}
