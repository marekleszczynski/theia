/*
 * Copyright (C) 2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { interfaces, ContainerModule } from 'inversify';
import { FrontendApplicationContribution, WebSocketConnectionProvider } from '@theia/core/lib/browser';
import { bindContributionProvider } from '@theia/core';
import { MonacoTextmateServer, monacoTextmatePath } from '../common/monaco-textmate-protocol';
import { MonacoTextmateFrontendApplicationContribution } from './monaco-textmate-frontend-contribution';
import { LanguageGrammarDefinitionContribution } from './textmate-contribution';
import { TextmateRegistry, TextmateRegistryImpl } from './textmate-registry';
import { MonacoTextmateService } from './monaco-textmate-service';
import { MonacoTextmateBuiltinGrammarContribution } from '.';

export default new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind, isBound: interfaces.IsBound, rebind: interfaces.Rebind) => {
    bind(FrontendApplicationContribution).to(MonacoTextmateFrontendApplicationContribution).inSingletonScope();
    bindContributionProvider(bind, LanguageGrammarDefinitionContribution);

    bind(TextmateRegistry).to(TextmateRegistryImpl).inSingletonScope();
    bind(LanguageGrammarDefinitionContribution).to(MonacoTextmateBuiltinGrammarContribution).inSingletonScope();

    bind(MonacoTextmateServer).toDynamicValue(ctx => {
        const connection = ctx.container.get(WebSocketConnectionProvider);
        return connection.createProxy<MonacoTextmateServer>(monacoTextmatePath);
    }).inSingletonScope();
    bind(MonacoTextmateService).toSelf().inSingletonScope();
});
