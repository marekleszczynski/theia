/**
 * Copyright (C) 2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { ContainerModule } from "inversify";
import { BackendApplicationContribution } from "@theia/core/lib/node";
import { ConnectionHandler, JsonRpcConnectionHandler } from '@theia/core/lib/common';
import { MonacoTextmateServer, monacoTextmatePath } from '../common/monaco-textmate-protocol';
import { MonacoTextmateBackendContribution } from "./monaco-textmate-backend-contribution";
import { VscodeTextmateThemeParser } from "./vscode-tmtheme-parser";
import { MonacoTextmateServerImpl } from "./monaco-textmate-server";
import { ThemeParser } from "./theme-parser";

export default new ContainerModule(bind => {
    bind(MonacoTextmateBackendContribution).toSelf().inSingletonScope();
    bind(BackendApplicationContribution).toService(MonacoTextmateBackendContribution);

    bind(ThemeParser).to(VscodeTextmateThemeParser);

    bind(MonacoTextmateServer).to(MonacoTextmateServerImpl);
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new JsonRpcConnectionHandler(monacoTextmatePath, () =>
            ctx.container.get(MonacoTextmateServer)
        )
    ).inSingletonScope();
});
