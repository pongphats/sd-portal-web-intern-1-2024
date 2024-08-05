import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from "@angular/material/core";
import { Injectable } from "@angular/core";

const SUPPORTS_INTL_API = typeof Intl != 'undefined';
@Injectable()
export class AppDateAdapter extends NativeDateAdapter {
    
    override parse(value: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            const year = Number(str[2])-543;
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }
   
    override format(date: Date, displayFormat: Object): string {
        if (displayFormat === "input") {
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear()+543;
            return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
        } else {
            let year = date.getFullYear()+543;
            return year.toString();
        }
    }
 
    private _to2digit(n: number) {
        return ('00' + n).slice(-2);
    } 
    
}

export const APP_DATE_FORMATS =
{
    parse: {
        dateInput: {month: 'short', year: 'numeric', day: 'numeric'}
    },
    display: {
        // dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
        dateInput: 'input',
        monthYearLabel: {year: 'numeric', month: 'short'},
        dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
        monthYearA11yLabel: {year: 'numeric', month: 'long'},
    }
}