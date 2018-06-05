/**
 * Copyright (C) 2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject } from 'inversify';
import { FileSystem } from '@theia/filesystem/lib/common';
import { MonacoTextmateServer } from '../common/monaco-textmate-protocol';
import { ThemeParser, ThemeResolver } from './theme-parser';
import URI from '@theia/core/lib/common/uri';

@injectable()
export class MonacoTextmateServerImpl implements MonacoTextmateServer, ThemeResolver {

    protected readonly themeFolder = '../../data/themes/vscode';
    protected readonly grammarFolder = '../../data/grammars';

    @inject(FileSystem)
    protected readonly fileSystem: FileSystem;

    @inject(ThemeParser)
    protected readonly parser: ThemeParser;

    async getGrammarFromUri(grammarUri: string): Promise<string> {
        const uri = new URI(__dirname).resolve(this.grammarFolder).resolve(grammarUri);
        const resolved = await this.fileSystem.resolveContent(uri.toString());
        return resolved.content;
    }

    async getGrammarForLanguage(languageName: string): Promise<any> {
        return this.getGrammarFromUri(`./${languageName}-tmlanguage.json`);
    }

    async getAvailableTextmateThemes(): Promise<string[]> {
        const themes: string[] = [];
        const fileStat = await this.fileSystem.getFileStat(this.themeFolder);
        for (const childStat of fileStat!.children!) {
            const name = childStat.uri
                .replace(/\.\w*?$/, '') // remove extension
                .replace(/^.*\//, '') // remove front path
                ;
            themes.push(name);
        }
        return themes;
    }

    async getThemeContentFromUri(themeUri: string): Promise<string> {
        const uri = new URI(__dirname).resolve(this.themeFolder).resolve(themeUri);
        const resolved = await this.fileSystem.resolveContent(uri.toString());
        return resolved.content;
    }

    async getThemeFromUri(themeUri: string): Promise<any> {
        return this.parser.parseRawTheme(
            await this.getThemeContentFromUri(themeUri));
    }

    async getThemeContent(name: string): Promise<string> {
        return this.getThemeContentFromUri(`./${name}.json`);
    }

    async getTheme(name: string): Promise<any> {
        console.log(`REQUESTING ${name} THEME`);
        return this.parser.parseRawTheme(
            await this.getThemeContent(name));
    }

    async getThemeRules(name: string): Promise<string[]> {
        return this.parser.parseThemeIntoRules(this, await this.getTheme(name));
    }

}
