import {INotarySigner} from '../client'
import * as exec from '@actions/exec'

const NOTATION_CMD = 'notation'

class Notation implements INotarySigner {
   sign: () => void
}
