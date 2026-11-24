declare module "lunar-javascript" {
  export class JieQi {
    getName(): string;
    getSolar(): Solar;
  }

  export class LunarTime {
    getGanZhi(): string;
    getTianShen(): string;
    getTianShenType(): string;
    getTianShenLuck(): string;
  }

  export class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Solar;
    static fromDate(date: Date): Solar;
    getLunar(): Lunar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getWeek(): number;
    getWeekInChinese(): string;
    toString(): string;
    toFullString(): string;
  }
  export class Lunar {
    static fromYmd(year: number, month: number, day: number): Lunar;
    getSolar(): Solar;
    getDay(): number;
    getMonth(): number;
    getYear(): number;
    getDayInChinese(): string;
    getMonthInChinese(): string;
    getYearInChinese(): string;
    getYearInGanZhi(): string;
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
    getPrevJieQi(wholeDay?: boolean): JieQi | null;
    getNextJieQi(wholeDay?: boolean): JieQi | null;
    getJieQi(): string;
    getZhiXing(): string;
    getXiu(): string;
    getXiuLuck(): string;
    getXiuSong(): string;
    getDayTianShen(): string;
    getDayTianShenType(): string;
    getDayTianShenLuck(): string;
    getDayYi(): string[];
    getDayJi(): string[];
    getDayNaYin(): string;
    getYearNaYin(): string;
    getTime(): LunarTime;
    toString(): string;
  }
}
