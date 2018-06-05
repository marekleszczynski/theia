/**
 * Copyright (C) 2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject } from 'inversify';
import { BackendApplicationContribution } from '@theia/core/lib/node';
import { MonacoTextmateServer } from '../common/monaco-textmate-protocol';

@injectable()
export class MonacoTextmateBackendContribution implements BackendApplicationContribution {

    @inject(MonacoTextmateServer)
    protected readonly tmServer: MonacoTextmateServer;

    onStart() {
        console.log('MONACO-TEXTMATE-BACKEND');
    }
}
