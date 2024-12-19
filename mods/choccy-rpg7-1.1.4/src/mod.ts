/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/indent */
import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { CustomItemService } from "@spt/services/mod/CustomItemService";
import { NewItemFromCloneDetails } from "@spt/models/spt/mod/NewItemDetails";
import { DatabaseServer } from "@spt/servers/DatabaseServer";

import { ItemTpl } from "@spt/models/enums/ItemTpl";
import { Traders } from "@spt/models/enums/Traders";
import preset_file from "../src/Item_Preset.json";
import global_preset_file from "../src/global_item_preset.json";
import loot from "../src/Spawns.json";
import config from "../config/config.json";

class Mod implements IPostDBLoadMod
{
	public postDBLoad(container: DependencyContainer): void 
	{
		const customitem = container.resolve<CustomItemService>("CustomItemService");
		const databaseserver = container.resolve<DatabaseServer>("DatabaseServer");
		const db = databaseserver.getTables()
		const globals = db.globals;
		const PRP = db.traders[Traders.PRAPOR].assort;
		//---WEAPON LISTING AND ATTACHMENT---
		const weapon_rpg7: NewItemFromCloneDetails = 
		{
			itemTplToClone: "5e81ebcd8e146c7080625e15",
			overrideProperties: {
				BackgroundColor: "yellow",
				AimPlane: 0.03,
				AimSensitivity: 0.55,
				CenterOfImpact: 0.4,
				Chambers: [
					{
						"_id": "668b9c4618fcdec559709609",
						"_mergeSlotWithChildren": false,
						"_name": "patron_in_weapon",
						"_parent": "668b9c37adf8dd87dcd87df9",
						"_props": {
							"filters": [
								{
									"Filter": [
										"65f484909638b1821d56149e"
									]
								}
							]
						},
						"_proto": "55d4af244bdc2d962f8b4571",
						"_required": false
					}
				],
				CompactHandling: false,
				CanSellOnRagfair: false,
				Ergonomics: 34,
				Foldable: false,
				Height: 2,
				Width: 7,
				IronSightRange: 50,
				LootExperience: 35,
				RecoilCenter: {
					x: 0.039,
					y: -0.016,
					z: 0.024
				},
				RecoilForceBack: 68,
				RecoilForceUp: 45,
				RecoilDampingHandRotation: 0.75,
				RecoilCamera: 0,
				blockLeftStance: true,
				RotationCenter: {
					x: 0.039,
					y: -0.016,
					z: 0.024
				},
				RotationCenterNoStock: {
					x: 0.039,
					y: -0.016,
					z: 0.024
				},
				Weight: 6.3,
				defAmmo: "65f484909638b1821d56149e",
				ammoCaliber: "Caliber40mm",
				isBoltCatch: false,
				Slots: [
					{
						"_id": "668b9c4169fa7f86b96a072f",
						"_mergeSlotWithChildren": false,
						"_name": "mod_sight_front",
						"_parent": "668b9c37adf8dd87dcd87df9",
						"_props": {
						  "filters": [
							{
							  "Filter": [
								"668b9c27558936e864b4a504"
							  ],
							  "Shift": 0
							}
						  ]
						},
						"_proto": "55d30c4c4bdc2db4468b457e",
						"_required": false
					},
					{
						"_id": "668b9c2ee622e896622dd1cc",
						"_mergeSlotWithChildren": false,
						"_name": "mod_sight_rear",
						"_parent": "668b9c37adf8dd87dcd87df9",
						"_props": {
						  "filters": [
							{
							  "Filter": [
								"668b9c1b327f6a93d2375db3"
							  ],
							  "Shift": 0
							}
						  ]
						},
						"_proto": "55d30c4c4bdc2db4468b457e",
						"_required": false
					}
				],
				Prefab: {
					path: "rpg7/weapon_rpg7_container.bundle",
					rcid: ""
				}
			},
			parentId: "5447bedf4bdc2d87278b4568",
			newId: "668b9c37adf8dd87dcd87df9",
			handbookParentId: "5b5f79eb86f77447ed5636b7",
			fleaPriceRoubles: 511073,
			handbookPriceRoubles: 417322,
			locales: {
				"en": {
					name: "RPG-7V2 \"Ruchnoy Protivotankovyy Granatomot\" Handheld Anti-Tank Grenade Launcher",
					shortName: "RPG-7V2",
					description: "The RPG-7 is a portable and reusable Shoulder launched rocket propelled grenade launcher. The ruggedness, simplicity, low cost, and effectiveness of the RPG-7 has made it the most widely used anti-armor weapon in the world. Currently around 40 countries use the weapon; it is manufactured in several variants by nine countries. It is popular with irregular and guerrilla forces. The RPG-7 can fire a variety of warheads for anti-armor or anti-personnel."
				}
			}
		}
		customitem.createItemFromClone(weapon_rpg7);

		const sight_front_rpg7: NewItemFromCloneDetails ={
			itemTplToClone: "5ba26b01d4351e0085325a51",
			overrideProperties: {
				AimSensitivity: [
					[
						0.55
					]
				],
				Prefab: {
					path: "rpg7/mod_front_sight_rpg7.bundle",
					rcid: ""
				},
				SightingRange: 50
			},
			parentId: "55818ac54bdc2d5b648b456e",
			newId: "668b9c27558936e864b4a504",
			fleaPriceRoubles: 8755,
			handbookPriceRoubles: 7544,
			handbookParentId: "5b5f746686f77447ec5d7708",
			locales: {
				"en": 
				{
					name: "RPG-7 Standard Front Iron Sight",
					shortName: "RPG-7 Iron",
					description: "A standard issue iron sight made for RPG-7"
				}
			}
		}
		customitem.createItemFromClone(sight_front_rpg7);

		const sight_rear_rpg7: NewItemFromCloneDetails ={
			itemTplToClone: "5ba26b17d4351e00367f9bdd",
			overrideProperties: {
				AimSensitivity: [
					[
						0.55
					]
				],
				Prefab: {
					path: "rpg7/mod_rear_sight_rpg7.bundle",
					rcid: ""
				},
				SightingRange: 50
			},
			parentId: "55818ac54bdc2d5b648b456e",
			newId: "668b9c1b327f6a93d2375db3",
			fleaPriceRoubles: 8755,
			handbookPriceRoubles: 7544,
			handbookParentId: "5b5f746686f77447ec5d7708",
			locales: {
				"en": 
				{
					name: "RPG-7 Standard Rear Iron Sight",
					shortName: "RPG-7 Iron",
					description: "A standard issue iron sight made for RPG-7"
				}
			}
		}
		customitem.createItemFromClone(sight_rear_rpg7);

		const patron_pg7vl: NewItemFromCloneDetails ={
			itemTplToClone: "5ede474b0c226a66f5402622",
			overrideProperties: {
				ArmorDamage: 100,
				AmmoLifeTimeSec: 60,
				ArmorDistanceDistanceDamage: {
					x: 1,
					y: 5,
					z: 26
				},
				CanSellOnRagfair: false,
				Caliber: "Caliber93x40mm",
				BallisticCoeficient: 0.078,
				Damage: 210,
				ExplosionStrength: 95,
				FragmentsCount: 50,
				FuzeArmTimeSec: 0.18,
				FragmentType: "5996f6d686f77467977ba6cc",
				Height: 1,
				Width: 5,
				InitialSpeed: 112,
				MaxExplosionDistance: config.ExplosionMax,
				MinExplosionDistance: config.ExplosionMin,
				ExplosionType: "rpg_explosion",
				PenetrationPower: 0,
				Prefab: {
					path: "rpg7/patron_rpg7_pg7vl_93x40mm.bundle",
					rcid: ""
				},
				ShowBullet: true,
				ShowHitEffectOnExplode: true,
				RemoveShellAfterFire: true,
				Tracer: true,
				TracerColor: "tracerRed",
				Weight: 2.6
			},
			parentId: "5485a8684bdc2da71d8b4567",
			newId: "65f484909638b1821d56149e",
			fleaPriceRoubles: 86654,
			handbookPriceRoubles: 75542,
			handbookParentId: "5b47574386f77428ca22b33b",
			locales: {
				"en": 
				{
					name: "PG-7VL Anti-Tank HEAT Warhead",
					shortName: "PG-7VL",
					description: "RPG-7 Round with an improved HEAT warhead, most effective against light and some armored target. Not recommended to fire into human unless you want red mist."
				}
			}
		}
		customitem.createItemFromClone(patron_pg7vl);
		//---MASTERY AND TRADER---
		PRP.items.push(...preset_file.items);

		for (const bsc in preset_file.barter_scheme)
		{
			PRP.barter_scheme[bsc] = preset_file.barter_scheme[bsc];
		}
  
		for (const llv in preset_file.loyal_level_items)
		{
			PRP.loyal_level_items[llv] = preset_file.loyal_level_items[llv];
		}
		
		//---Global Weapon Preset---
		for (const itemPreset in global_preset_file.ItemPresets)
	  	{
			globals.ItemPresets[itemPreset] = global_preset_file.ItemPresets[itemPreset];
	  	}

		db.locations.rezervbase.looseLoot.spawnpoints.push(...loot.spawnsRezerv);
		
		//---For Other tidbits of manipulation---
		db.templates.items[ItemTpl.INVENTORY_DEFAULT]._props.Slots[0]._props.filters[0].Filter.push("668b9c37adf8dd87dcd87df9");
		db.templates.items[ItemTpl.INVENTORY_DEFAULT]._props.Slots[1]._props.filters[0].Filter.push("668b9c37adf8dd87dcd87df9");		
	}
}

export const mod = new Mod();