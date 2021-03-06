// @flow
import { ADDR_PORTS } from './addrPorts';
import { ROOM_LABELS } from './roomLabels';

export type roomType = { addr: string; port: number; thread: number; roomLabel: string };

export default class RoomInfo {
  playerStatus: any;
  thread: number;
  community: string;
  currentRoomIndex: number;
  currentAddrPortIndex: number;
  constructor(playerStatus: any) {
    this.thread = Number(playerStatus['ms']['thread']);
    this.community = playerStatus['stream']['default_community'];
    this.setCurrentRoomIndex(playerStatus['user']['room_label']);
    this.setCurrentAddrPortIndex(playerStatus['ms']['addr'], Number(playerStatus['ms']['port']));
  }

  current() {
    return this.roomAddrPort(this.currentRoomIndex);
  }

  arena() {
    let room = this.roomAddrPort(0);
    room['roomLabel'] = this.community;
    return room;
  }

  a() {
    return this.roomAddrPort(1);
  }

  b() {
    return this.roomAddrPort(2);
  }

  c() {
    return this.roomAddrPort(3);
  }

  d() {
    return this.roomAddrPort(4);
  }

  e() {
    return this.roomAddrPort(5);
  }

  f() {
    return this.roomAddrPort(6);
  }

  g() {
    return this.roomAddrPort(7);
  }

  h() {
    return this.roomAddrPort(8);
  }

  i() {
    return this.roomAddrPort(9);
  }

  roomAddrPort(roomLabelIndex: number) {
    let addrPorts = ADDR_PORTS[this.currentAddrPortIndex - this.currentRoomIndex + roomLabelIndex];
    addrPorts['roomLabel'] = String(ROOM_LABELS[roomLabelIndex]).substr(2, String(ROOM_LABELS[roomLabelIndex]).length - 4);
    addrPorts['thread'] = this.thread - this.currentRoomIndex + roomLabelIndex;
    return addrPorts;
  }

  setCurrentRoomIndex(roomLabel: string) {
    for(let i = 0; i < ROOM_LABELS.length; i++) {
      if (roomLabel.match(ROOM_LABELS[i])) {
        this.currentRoomIndex = i;
      }
    }
  }

  setCurrentAddrPortIndex(addr: string, port: number) {
    for(let i = 0; i < ADDR_PORTS.length; i++) {
      if (ADDR_PORTS[i]['addr'] === addr && ADDR_PORTS[i]['port'] === port) {
        this.currentAddrPortIndex = i;
        break
      }
    }
  }
}
