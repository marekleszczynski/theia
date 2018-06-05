/**
 * Copyright (C) 2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

export const monacoTextmatePath = '/services/monaco-textmate';

export const MonacoTextmateServer = Symbol('MonacoTextmateServer');
export interface MonacoTextmateServer {

    getGrammarFromUri(uri: string): Promise<string>

    getGrammarForLanguage(languageName: string): Promise<any>;

    getAvailableTextmateThemes(): Promise<string[]>;

    getThemeContentFromUri(themeUri: string): Promise<string>;

    getThemeFromUri(themeUri: string): Promise<any>;

    getThemeContent(name: string): Promise<string>;

    getTheme(name: string): Promise<any>;

    getThemeRules(name: string): Promise<string[]>;
}

export interface TextmateGrammar {
    type: string;
    content: string;
}
