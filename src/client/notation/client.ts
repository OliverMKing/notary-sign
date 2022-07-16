import {INotarySigner} from '../client'
import * as exec from '@actions/exec'

const NOTATION_CMD = 'notation'

export class Notation implements INotarySigner {
   sign(): void {
      exec.exec(NOTATION_CMD, ['--help'])
   }
}
