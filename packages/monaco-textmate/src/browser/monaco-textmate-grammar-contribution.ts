/**
 * Copyright (C) 2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject } from 'inversify';
import { LanguageGrammarDefinitionContribution } from './textmate-contribution';
import { MonacoTextmateServer } from '../common/monaco-textmate-protocol';
import { TextmateRegistry } from './textmate-registry';

export interface BuiltinGrammar {
    format: 'json' | 'plist';
    language: string;
    scope: string;
    filepath: string;
}

@injectable()
export class MonacoTextmateBuiltinGrammarContribution implements LanguageGrammarDefinitionContribution {

    protected readonly builtins: BuiltinGrammar[] = [
        {
            format: 'json',
            language: 'typescript',
            scope: 'source.ts',
            filepath: './typescript.tmlanguage.json',
        },
        {
            format: 'json',
            language: 'javascript',
            scope: 'source.js',
            filepath: './javascript.tmlanguage.json',
        }
    ];

    @inject(MonacoTextmateServer)
    protected readonly tmServer: MonacoTextmateServer;

    async registerTextmateLanguage(registry: TextmateRegistry): Promise<void> {
        const _this = this;
        for (const grammar of this.builtins) {
            registry.registerTextMateGrammarScope(grammar.scope, {
                async getGrammarDefinition() {
                    return {
                        format: grammar.format,
                        content: await _this.tmServer.getGrammarFromUri(grammar.filepath),
                    };
                }
            });

            registry.mapLanguageIdToTextmateGrammar(grammar.language, grammar.scope);
        }
    }
}
