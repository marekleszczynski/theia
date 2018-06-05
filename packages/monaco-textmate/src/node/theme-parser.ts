/**
 * Copyright (C) 2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

export const ThemeParser = Symbol('ThemeParser');
export interface ThemeParser {

    canParse(uri: string): boolean;

    parseRawTheme(content: string): Promise<string>;

    parseThemeIntoRules(themeResolver: ThemeResolver, themeObject: any, rules?: string[]): Promise<string[]>;
}

export interface ThemeResolver {
    getThemeFromUri(themeUri: string): Promise<any>;
}
