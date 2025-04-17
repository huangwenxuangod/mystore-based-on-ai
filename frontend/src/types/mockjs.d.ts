declare module 'mockjs' {
  interface MockjsRandom {
    natural(min?: number, max?: number): number;
    integer(min?: number, max?: number): number;
    float(min?: number, max?: number, dmin?: number, dmax?: number): number;
    character(pool?: string): string;
    string(pool?: string, min?: number, max?: number): string;
    range(start?: number, stop?: number, step?: number): number[];
    date(format?: string): string;
    time(format?: string): string;
    datetime(format?: string): string;
    now(unit?: string, format?: string): string;
    image(size?: string, background?: string, foreground?: string, format?: string, text?: string): string;
    color(format?: string): string;
    hex(): string;
    rgb(): string;
    rgba(): string;
    hsl(): string;
    paragraph(min?: number, max?: number): string;
    cparagraph(min?: number, max?: number): string;
    sentence(min?: number, max?: number): string;
    csentence(min?: number, max?: number): string;
    word(min?: number, max?: number): string;
    cword(pool?: string | number, min?: number, max?: number): string;
    title(min?: number, max?: number): string;
    ctitle(min?: number, max?: number): string;
    first(): string;
    last(): string;
    name(middle?: boolean): string;
    cfirst(): string;
    clast(): string;
    cname(): string;
    url(protocol?: string, host?: string): string;
    domain(tld?: string): string;
    email(domain?: string): string;
    ip(): string;
    pick<T>(arr: T[]): T;
    shuffle<T>(arr: T[]): T[];
    guid(): string;
    id(): string;
    increment(step?: number): number;
    capitalize(word: string): string;
    upper(str: string): string;
    lower(str: string): string;
    boolean(min?: number, max?: number, current?: number): boolean;
    bool(min?: number, max?: number, current?: number): boolean;
  }
  
  interface MockConfig {
    timeout?: string | number;
    rurl?: RegExp;
    rtype?: string;
    name?: string;
    template?: any;
  }

  interface Mock {
    mock<T>(template: T): T;
    mock(rurl: string | RegExp, template: any): void;
    mock(rurl: string | RegExp, rtype: string, template: any): void;
    mock(rurl: string | RegExp, rtype: string, function: (...args: any[]) => any): void;
    Random: MockjsRandom;
    setup(settings: MockConfig): void;
    valid(template: any, data: any): boolean;
    toJSONSchema(template: any): any;
  }

  const Mock: Mock;
  export = Mock;
}