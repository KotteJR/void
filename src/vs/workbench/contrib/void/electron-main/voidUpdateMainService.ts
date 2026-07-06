/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IVoidUpdateService } from '../common/voidUpdateService.js';
import { VoidCheckUpdateRespose } from '../common/voidUpdateServiceTypes.js';



export class VoidMainUpdateService extends Disposable implements IVoidUpdateService {
	_serviceBrand: undefined;

	constructor() {
		super()
	}

	async check(explicit: boolean): Promise<VoidCheckUpdateRespose> {
		// Auto-update is disabled in this build - we don't ship binaries to a release
		// server, so never phone home. Users update by rebuilding/reinstalling.
		return { message: null } as const
	}
}
