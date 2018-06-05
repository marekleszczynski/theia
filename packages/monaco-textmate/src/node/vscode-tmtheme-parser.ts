/**
 * Copyright (C) 2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable } from 'inversify';
import { ThemeParser } from './theme-parser';
import { ThemeResolver } from './theme-parser';
import * as jsonparser from 'jsonc-parser';

@injectable()
export class VscodeTextmateThemeParser implements ThemeParser {

    canParse(uri: string): boolean {
        return /\/vscode\//.test(uri);
    }

    async parseRawTheme(content: string): Promise<string> {
        return jsonparser.parse(jsonparser.stripComments(content));
    }

    async parseThemeIntoRules(themeResolver: ThemeResolver, themeObject: any, rules: string[] = []): Promise<string[]> {

        // Recursion in order to follow the theme dependencies that vscode has...
        if (typeof themeObject.include !== 'undefined') {
            const subTheme = await themeResolver.getThemeFromUri(themeObject.include);
            await this.parseThemeIntoRules(themeResolver, subTheme, rules);
        }

        if (typeof themeObject.tokenColors === 'undefined') {
            return rules;
        } for (const tokenColor of themeObject.tokenColors) {

            if (typeof tokenColor.scope === 'undefined') {
                tokenColor.scope = [''];
            } else if (typeof tokenColor.scope === 'string') {
                // tokenColor.scope = tokenColor.scope.split(',').map((scope: string) => scope.trim()); // ?
                tokenColor.scope = [tokenColor.scope];
            }

            // console.log(`TokenColor: ${JSON.stringify(tokenColor)}`);
            for (const scope of tokenColor.scope) {
                // console.log(`   Scope: ${scope}`);

                // Converting numbers into a format that monaco understands
                const settings = Object.keys(tokenColor.settings).reduce((previous: any, current) => {
                    let value: string = tokenColor.settings[current];
                    if (typeof value === typeof '') {
                        value = value.replace(/^\#/, '').slice(0, 6);
                    }
                    previous[current] = value;
                    return previous;
                }, {});

                rules.push({
                    token: scope, ...settings
                });
            }
        }

        return rules;
    }

}
