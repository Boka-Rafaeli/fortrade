import { FooterComponent } from "../../app/components";
import { Page } from "@playwright/test";

export class MainScreen{
    readonly footer: FooterComponent;

    constructor(private page: Page){
       this.footer = new FooterComponent(page);
    }
}

