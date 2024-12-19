import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ItemHelper } from "@spt/helpers/ItemHelper";
import { BaseClasses } from "@spt/models/enums/BaseClasses";

class Mod implements IPostDBLoadMod
{
    public postDBLoad(container: DependencyContainer): void
    {
        // get database from server
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");

        // Get all the in-memory json found in /assets/database
        const tables: IDatabaseTables = databaseServer.getTables();

        //---------------------------------------------------------------------------------------------
        //Saiga changes
        const saiga = tables.templates.items["576165642459773c7a400233"];
        saiga._props.weapFireType.push("fullauto");
        saiga._props.bFirerate = 450;        
        saiga._props.Ergonomics = 80;
        saiga._props.RecoilCamera = 0.045;
        saiga._props.RecoilForceBack = 200;
        saiga._props.RecoilForceUp = 70;
        saiga._props.RecoilCategoryMultiplierHandRotation = 0.207;
        saiga._props.RecoilReturnSpeedHandRotation = 2.5;
        saiga._props.RecolDispersion = 10;
        saiga._props.RecoilReturnPathDampingHandRotation = 0.4;
        //---------------------------------------------------------------------------------------------
        //HK416 changes
        const hk416 = tables.templates.items["5bb2475ed4351e00853264e3"];
        hk416._props.Weight = 0.38;
        hk416._props.bFirerate = 700;
        hk416._props.Ergonomics = 64;
        hk416._props.bEffDist = 700;        
        hk416._props.CenterOfImpact = 0.046;
        hk416._props.AimPlane = 0.2;
        hk416._props.RecoilCamera = 0.045;
        hk416._props.RecoilForceBack = 200;
        hk416._props.RecoilForceUp = 50;
        hk416._props.RecoilReturnPathDampingHandRotation = 0.24;
        //---------------------------------------------------------------------------------------------
        //M1A changes
        const m1a = tables.templates.items["5aafa857e5b5b00018480968"];
        m1a._props.weapFireType.push("fullauto");
        m1a._props.Weight = 0.70;
        m1a._props.bFirerate = 600;
        m1a._props.Ergonomics = 64;
        m1a._props.RecoilCamera = 0.045;
        m1a._props.RecoilForceBack = 250;
        m1a._props.RecoilForceUp = 60;        
        m1a._props.RecoilCategoryMultiplierHandRotation = 0.207;
        m1a._props.RecoilReturnSpeedHandRotation = 2.5;
        m1a._props.RecoilDampingHandRotation = 0.85;
        m1a._props.RecolDispersion = 10;
        m1a._props.RecoilReturnPathDampingHandRotation = 0.4;
        //---------------------------------------------------------------------------------------------
        //VPO209 changes
        const vpo209 = tables.templates.items["59e6687d86f77411d949b251"];
        vpo209._props.weapFireType.push("fullauto");
        vpo209._props.Weight = 1;
        vpo209._props.bFirerate = 700;
        vpo209._props.Ergonomics = 60;
        vpo209._props.bEffDist = 700;       
        vpo209._props.CenterOfImpact = 0.046;
        vpo209._props.AimPlane = 0.2;        
        vpo209._props.RecoilCategoryMultiplierHandRotation = 0.207;
        vpo209._props.RecoilReturnSpeedHandRotation = 2.5;
        vpo209._props.RecoilDampingHandRotation = 0.85;  
        vpo209._props.RecoilCamera = 0.045;
        vpo209._props.RecoilForceBack = 220;
        vpo209._props.RecoilForceUp = 55;
        vpo209._props.RecolDispersion = 10;
        vpo209._props.RecoilReturnPathDampingHandRotation = 0.4;
        //---------------------------------------------------------------------------------------------
        //VPO136 changes
        const vpo136 = tables.templates.items["59e6152586f77473dc057aa1"];
        vpo136._props.weapFireType.push("fullauto");
        vpo136._props.Weight = 1;
        vpo136._props.bFirerate = 700;
        vpo136._props.Ergonomics = 55;
        vpo136._props.bEffDist = 700;       
        vpo136._props.CenterOfImpact = 0.046;
        vpo136._props.AimPlane = 0.2;        
        vpo136._props.RecoilCategoryMultiplierHandRotation = 0.207;
        vpo136._props.RecoilReturnSpeedHandRotation = 2.5;
        vpo136._props.RecoilDampingHandRotation = 0.85;  
        vpo136._props.RecoilCamera = 0.045;
        vpo136._props.RecoilForceBack = 210;
        vpo136._props.RecoilForceUp = 50;
        vpo136._props.RecolDispersion = 10;
        vpo136._props.RecoilReturnPathDampingHandRotation = 0.4;
        //---------------------------------------------------------------------------------------------
        //SAG changes
        const sag = tables.templates.items["628b5638ad252a16da6dd245"];
        sag._props.weapFireType.push("fullauto");
        sag._props.Weight = 1.4;
        sag._props.bFirerate = 700;
        sag._props.Ergonomics = 61;
        sag._props.bEffDist = 700;       
        sag._props.CenterOfImpact = 0.033;
        sag._props.AimPlane = 0.2;        
        sag._props.RecoilCategoryMultiplierHandRotation = 0.207;
        sag._props.RecoilReturnSpeedHandRotation = 2.5;
        sag._props.RecoilDampingHandRotation = 0.85;  
        sag._props.RecoilCamera = 0.043;
        sag._props.RecoilForceBack = 220;
        sag._props.RecoilForceUp = 55;
        sag._props.RecolDispersion = 10;
        sag._props.RecoilReturnPathDampingHandRotation = 0.4;
        //---------------------------------------------------------------------------------------------
        //X-47 and AS Val changes
        const x47 = tables.templates.items["5cfe8010d7ad1a59283b14c6"];
        x47._props.Cartridges[0]._props.filters[0].Filter.push("5c0d688c86f77413ae3407b2");
        x47._props.Cartridges[0]._props.filters[0].Filter.push("6576f96220d53a5b8f3e395e");
        x47._props.Cartridges[0]._props.filters[0].Filter.push("61962d879bb3d20b0946d385");
        x47._props.Cartridges[0]._props.filters[0].Filter.push("57a0dfb82459774d3078b56c");
        x47._props.Cartridges[0]._props.filters[0].Filter.push("5c0d668f86f7747ccb7f13b2");
        x47._props.Cartridges[0]._props.filters[0].Filter.push("57a0e5022459774d1673f889");

        const asval = tables.templates.items["57c44b372459772d2b39b8ce"];
        asval._props.Slots[2]._props.filters[0].Filter.push("5cfe8010d7ad1a59283b14c6");
        asval._props.Ergonomics = 74;
        asval._props.bEffDist = 700;       
        asval._props.CenterOfImpact = 0.01;
        asval._props.AimPlane = 0.16;        
        asval._props.RecoilCamera = 0.043;
        asval._props.RecoilForceBack = 210;
        asval._props.RecoilForceUp = 50;
        asval._props.RecolDispersion = 10;
        asval._props.RecoilReturnPathDampingHandRotation = 0.4;
        asval._props.DurabilityBurnRatio = 1.15;
        asval._props.HeatFactorGun = 1;
        asval._props.CoolFactorGun = 3.168;
        asval._props.CoolFactorGunMods = 1;
        asval._props.HeatFactorByShot = 1.235;
        asval._props.MaxRepairKitDegradation = 0.025;
    }
}

export const mod = new Mod();
