import { useState, useEffect, useCallback } from "react";

const LOGO_FANDI = null;

const G = {
  bg:"#0d0f14", surface:"#151820", surfaceAlt:"#1d2030", border:"#252840",
  accent:"#e8a020", accent2:"#3b82f6", green:"#22c55e", orange:"#f59e0b",
  red:"#ef4444", cyan:"#06b6d4", purple:"#a855f7",
  text:"#e2e8f0", textMuted:"#64748b", textDim:"#374151",
};
const COLORS = ["#e8a020","#3b82f6","#22c55e","#a855f7","#ef4444","#06b6d4","#f59e0b","#10b981","#8b5cf6","#f43f5e","#0ea5e9","#84cc16","#fb923c","#38bdf8","#4ade80","#c084fc"];
const TYPE_COLORS = ["#e8a020","#3b82f6","#22c55e","#a855f7","#ef4444","#06b6d4","#f59e0b","#10b981"];

const css = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${G.bg};color:${G.text};font-family:'Syne',sans-serif;min-height:100vh;}
  ::-webkit-scrollbar{width:5px;height:5px;}
  ::-webkit-scrollbar-track{background:${G.bg};}
  ::-webkit-scrollbar-thumb{background:${G.border};border-radius:3px;}
  input,select,textarea{background:${G.surfaceAlt};color:${G.text};border:1px solid ${G.border};border-radius:6px;padding:7px 11px;font-family:'Syne',sans-serif;font-size:13px;outline:none;width:100%;transition:border-color .2s;}
  input:focus,select:focus{border-color:${G.accent};}
  select option{background:${G.surface};}
  button{cursor:pointer;font-family:'Syne',sans-serif;}
  table{border-collapse:collapse;width:100%;}
  th,td{text-align:left;padding:8px 12px;border-bottom:1px solid ${G.border};}
  th{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:${G.textMuted};background:${G.surfaceAlt};}
  td{font-size:13px;}
  tr:hover td{background:rgba(255,255,255,.02);}
  tfoot td{border-top:2px solid ${G.border};font-weight:700;}
  .mono{font-family:'DM Mono',monospace;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}
  .fade{animation:fadeIn .25s ease;}
  pre{font-family:'DM Mono',monospace;font-size:12px;line-height:1.7;white-space:pre-wrap;word-break:break-all;}
  .badge-green{background:rgba(34,197,94,.12);color:${G.green};border:1px solid rgba(34,197,94,.3);padding:2px 8px;border-radius:4px;font-size:11px;}
  .badge-orange{background:rgba(245,158,11,.12);color:${G.orange};border:1px solid rgba(245,158,11,.3);padding:2px 8px;border-radius:4px;font-size:11px;}
  .badge-red{background:rgba(239,68,68,.12);color:${G.red};border:1px solid rgba(239,68,68,.3);padding:2px 8px;border-radius:4px;font-size:11px;}
  .badge-blue{background:rgba(59,130,246,.12);color:${G.accent2};border:1px solid rgba(59,130,246,.3);padding:2px 8px;border-radius:4px;font-size:11px;}
  .badge-purple{background:rgba(168,85,247,.12);color:${G.purple};border:1px solid rgba(168,85,247,.3);padding:2px 8px;border-radius:4px;font-size:11px;}
`;

const DEFAULT_PARAMS = {
  tarifsMO: { production:35, admin:45, logistique:32, be:55 },
  tarifsMachines: { gabbiani:28, osama:42, cnc3:65, cnc5:95, plaqueuse:38 },
  mdfPlaques: [
    { id:1, nom:"MDF 16mm 2440×1220", epaisseur:16, L:2440, l:1220, prix:24.5, marge:20 },
    { id:2, nom:"MDF 19mm 2440×1220", epaisseur:19, L:2440, l:1220, prix:29.8, marge:20 },
    { id:3, nom:"MDF 22mm 2800×2070", epaisseur:22, L:2800, l:2070, prix:54.0, marge:20 },
    { id:4, nom:"MDF 25mm 2440×1220", epaisseur:25, L:2440, l:1220, prix:38.0, marge:20 },
  ],
  matieres: [
    { id:1, nom:"Parquet Chêne 185×14", type:"rigide_clipable", longueurLame:1900, largeurLame:185, tempsParCoupe_sec:18 },
    { id:2, nom:"Vinyle LVT 305×610",         type:"rigide_clipable", longueurLame:610,  largeurLame:305, tempsParCoupe_sec:8  },
    { id:3, nom:"Stratifié AC5 1285×192", type:"rigide_clipable", longueurLame:1285, largeurLame:192, tempsParCoupe_sec:12 },
    { id:4, nom:"Vinyle souple 3m rouleau",   type:"souple",          longueurLame:3000, largeurLame:300, tempsParCoupe_sec:6  },
    { id:5, nom:"Parquet contrecollé 190×14", type:"rigide_clipable", longueurLame:1900, largeurLame:190, tempsParCoupe_sec:20 },
  ],
  colleOsama: { prix:4.8, consoG_m2:180 },
  colleBlanc:  { prix:3.2, consoG_ml:8 },
  chants: [
    { id:1, nom:"Chant ABS 22mm blanc", prix:1.2, marge:20, majoration:15 },
    { id:2, nom:"Chant ABS 22mm chêne", prix:1.8, marge:20, majoration:15 },
  ],
  etiquettes: [{ id:1, nom:"Étiquette standard", prix:0.08, marge:20 }],
  palettes: [
    { id:1, nom:"Palette EUR 1200×800", L:1200, l:800, prix:8.5, marge:20 },
    { id:2, nom:"Palette 1200×1000", L:1200, l:1000, prix:9.8, marge:20 },
  ],
  emballages: [
    { id:1, nom:"Carton protection", prix:0.45, marge:20, unite:"panneau" },
    { id:2, nom:"Film étirable",     prix:0.12, marge:20, unite:"palette" },
    { id:3, nom:"Stop-gliss",        prix:0.08, marge:20, unite:"palette" },
    { id:4, nom:"Notice montage",    prix:0.15, marge:20, unite:"panneau" },
  ],
  temps: {
    encodageOsama_sec:45, clipsage_sec:8, collagManuel_sec:25, colleBlanc_sec_ml:20,
    debitMDF_table:[
      { surfaceMax:0.5, sec:30 },{ surfaceMax:1.0, sec:45 },
      { surfaceMax:2.0, sec:65 },{ surfaceMax:9999, sec:90 },
    ],
    debitLattes_sec_ml:4,
    detorage:{ tempsFixe_sec:120, vitesseFraisage_mm_min:6000, poignee_sec:45, chanfrein_sec:30, coinsArrondis_sec:20, encoches_sec:40 },
    chantVitesse_m_min:3, chantTempsFixe_sec:60,
    etiquette_sec:12, controleNettoyage_sec:30,
    cerclage_sec_palette:90,
    picking_sec:20,   // par panneau, MO logistique
    priseInfo_min:70,
  },
  calepinage: { margeRangee:10, seuilReste:50 },
  generaux: { surcoteParCote_mm:3, traitScie_mm:3.5, seuilVert:35, seuilOrange:20, margeAchatDefaut:20 },
  commerciaux: [
    { nom:"Dupont Jean",   email:"jean.dupont@entreprise.fr" },
    { nom:"Martin Sophie", email:"sophie.martin@entreprise.fr" },
    { nom:"Bernard Paul",  email:"paul.bernard@entreprise.fr" },
    { nom:"Leroy Claire",  email:"claire.leroy@entreprise.fr" },
  ],
  emailInterne:"production@entreprise.fr",
};

const fmt  = (n,d=2) => typeof n==="number" ? n.toFixed(d).replace(".",",") : "-";
const fmtE = (n) => `${fmt(n)} €`;
const fmtH = (s) => {
  if (!s&&s!==0) return "-";
  const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sc=Math.round(s%60);
  if (h>0) return `${h}h${String(m).padStart(2,"0")}m${String(sc).padStart(2,"0")}s`;
  if (m>0) return `${m}m${String(sc).padStart(2,"0")}s`;
  return `${sc}s`;
};
function uid() { return Date.now().toString(36)+Math.random().toString(36).slice(2); }
const deepCopy = o => JSON.parse(JSON.stringify(o));

async function storageGet(k) { try { const r=await window.storage.get(k); return r?JSON.parse(r.value):null; } catch { return null; } }
async function storageSet(k,v) { try { await window.storage.set(k,JSON.stringify(v)); } catch {} }

const defaultTypePanneau = (params, idx=0) => ({
  id: uid(),
  nom: `Type ${idx+1}`,
  quantite: 10,
  dimensionL: 1200, dimensionl: 600,
  calepinageRecto: "classique", offsetPctRecto: 30,
  rectoVerso: false,
  calepinageVerso: "classique", offsetPctVerso: 30,
  matiereType: "parquet",   // parquet | stratifie | vinyle_rigide | vinyle_souple
  lameL: 1900,              // longueur lame mm
  lamel: 185,               // largeur lame mm
  tempsCoupe: 18,           // s/coupe Gabbiani
  mdfRefId: params?.mdfPlaques[0]?.id || 1,
  supportMDF: "plein",
  latteL: 400,           // longueur lame MDF mm
  lattel: 60,            // largeur lame MDF mm
  lattesParPanneau: 3,   // nb de lattes par panneau
  clipsage: false, collageManuel: false, encollageOsama: true,
  detourage: false, cnc5axes: false,
  options: { poignee:false, chanfrein:false, coinsArrondis:false, encoches:false },
  chant: false, chantRefId: 1,  // id du chant sélectionné
  etiquette: false, etiquetteFournie: false, facesEtiquetees: 1, etiquetteL: 100, etiquettel: 70,
  nbReferences: 1,
  palette: true, paletteType: params?.palettes[0]?.id || 1, panneauxParPalette: 10,
  emballages: [],
  margePct: 30,
});

function genLettre(n) {
  let s=""; n++;
  while(n>0){n--;s=String.fromCharCode(65+(n%26))+s;n=Math.floor(n/26);}
  return s;
}
function moteurCalepinage({ hauteurPanneau, largeurPanneau, largeurLame, longueurLame, margeRangee, offsetPct, seuilReste }) {
  const longueurRangee = hauteurPanneau + margeRangee;
  const offsetMm = Math.round(longueurRangee * offsetPct / 100);

  const traitScie = 4;
  const resteLargeur = largeurPanneau % largeurLame;
  const seuilCentrage = largeurLame * 0.5 + traitScie;
  const needsCentrage = resteLargeur > 0 && resteLargeur < seuilCentrage;
  const demiLameLargeur = (largeurLame - traitScie) / 2;

  const nbRangees = needsCentrage
    ? Math.floor(largeurPanneau / largeurLame) + 2
    : Math.ceil(largeurPanneau / largeurLame);

  let lamIdx = 0;
  const lames = {}, restes = [], rangees = [];

  const ouvrirLame = () => {
    const l = genLettre(lamIdx++);
    lames[l] = { longueurRestante: longueurLame, coupes: 0 };
    return l;
  };

  const trouverReste = (pos, longueurNecessaire) => {
    for (let i = 0; i < restes.length; i++) {
      const r = restes[i];
      if (r.utilise || r.longueur <= seuilReste) continue;
      if (r.longueur < longueurNecessaire) continue; // pas assez long
      if (pos === "DEBUT" && r.position === "DEBUT") return i;
      if (pos === "FIN"   && (r.position === "FIN" || r.position === "DEBUT")) return i;
    }
    return -1;
  };

  const couperDansLame = (lettre, longueur, posReste) => {
    const lam = lames[lettre];
    if (lam.coupes >= 2 || lam.longueurRestante < longueur) return null;
    const num = lam.coupes + 1;
    const resteVal = lam.longueurRestante - longueur;
    lam.coupes++;
    lam.longueurRestante = resteVal > 0 ? resteVal : 0;
    const posRst = posReste === "FIN" ? "DEBUT" : "FIN";
    if (resteVal > seuilReste) restes.push({ lettre, longueur: resteVal, position: posRst, utilise: false });
    return { id: `${lettre}${num}`, lettre, longueur, source: "lame" };
  };

  const couperDansReste = (iReste, longueur) => {
    const r = restes[iReste];
    if (r.longueur < longueur) return null;
    r.utilise = true;
    lames[r.lettre].coupes = 2; // lame épuisée après utilisation du reste
    return { id: `${r.lettre}2`, lettre: r.lettre, longueur, source: "reste" };
  };

  const obtenirPiece = (longueur, pos) => {
    const ir = trouverReste(pos, longueur);
    if (ir >= 0) { const p = couperDansReste(ir, longueur); if (p) return p; }
    for (const [l, lam] of Object.entries(lames))
      if (lam.coupes < 2 && lam.longueurRestante >= longueur) {
        const p = couperDansLame(l, longueur, pos); if (p) return p;
      }
    const l = ouvrirLame();
    return couperDansLame(l, longueur, pos);
  };

  const couvrirSegment = (longueurTotale, posSegment) => {
    const pieces = [];
    let restant = longueurTotale;
    let curseur = 0; // curseur local dans le segment

    while (restant > 0) {
      const longueurPiece = Math.min(restant, longueurLame);
      const pos = curseur === 0 ? posSegment : "FIN";
      const piece = obtenirPiece(longueurPiece, pos);
      pieces.push({ ...piece, debut: curseur, fin: curseur + longueurPiece });
      curseur += longueurPiece;
      restant -= longueurPiece;
    }
    return pieces;
  };

  let ripCutLame = null;
  if (needsCentrage) {
    ripCutLame = genLettre(lamIdx++);
    lames[ripCutLame] = { longueurRestante: longueurLame, coupes: 2, isRipCut: true };
  }

  const getDecalage = (idxNormal) => (idxNormal % 2 === 0) ? 0 : offsetMm;

  for (let i = 0; i < nbRangees; i++) {
    const num = i + 1;
    const isDemiGauche = needsCentrage && i === 0;
    const isDemiDroite = needsCentrage && i === nbRangees - 1;
    let pieces = [], decalage = 0;

    if (isDemiGauche || isDemiDroite) {
      const numPiece = isDemiGauche ? 1 : 2;
      pieces = [{ id:`${ripCutLame}${numPiece}`, lettre:ripCutLame, longueur:longueurRangee,
        source:"ripcut", debut:0, fin:longueurRangee, isDemi:true, largeurDemi: demiLameLargeur }];
      decalage = 0;
    } else {
      const idxNormal = needsCentrage ? i - 1 : i;
      decalage = getDecalage(idxNormal);
      if (decalage === 0) {
        pieces = couvrirSegment(longueurRangee, "DEBUT");
      } else {
        const piecesFin   = couvrirSegment(decalage, "FIN");
        const piecesDebut = couvrirSegment(longueurRangee - decalage, "DEBUT");
        pieces = [...piecesFin, ...piecesDebut.map(p => ({ ...p, debut: decalage + p.debut, fin: decalage + p.fin }))];
      }
    }

    const estDecale = decalage > 0;
    rangees.push({ num, estDecale, decalage, pieces, longueur: longueurRangee, isDemiGauche, isDemiDroite });
  }

  const synthLames = Object.entries(lames).map(([lettre, lam]) => {
    const pl = [];
    for (const r of rangees) for (const p of r.pieces) if (p.lettre === lettre) pl.push({ rangee: r.num, id: p.id, longueur: p.longueur });
    const ri = restes.find(r => r.lettre === lettre && !r.utilise);
    return { lettre, coupesEffectuees: lam.coupes, pieces: pl, resteFinal: ri ? ri.longueur : 0, isRipCut: !!lam.isRipCut };
  });

  const bm = {};
  for (const r of rangees) for (const p of r.pieces) bm[p.longueur] = (bm[p.longueur] || 0) + 1;
  const besoins = Object.entries(bm).map(([mm, nb]) => ({ mm: +mm, nbParPanneau: nb })).sort((a, b) => b.mm - a.mm);

  const totalPieces = rangees.reduce((s, r) => s + r.pieces.length, 0);
  const totalLames = Object.keys(lames).length;
  const perteMm = restes.filter(r => !r.utilise && r.longueur > 0).reduce((s, r) => s + r.longueur, 0);

  return { rangees, synthLames, besoins, nbRangees, longueurRangee, offsetMm, offsetPct, totalLames, totalPieces, perteMm, needsCentrage, demiLameLargeur, ripCutLame };
}

function calculerType(tp, params, calepRecto, calepVerso) {
  const p=params,g=p.generaux,t=p.temps;
  const qty=tp.quantite||1;
  const L=tp.dimensionL||1200,l_=tp.dimensionl||600;
  const rv=tp.rectoVerso||false;
  const nbFaces=rv?2:1;
  const surfFinie=(L*l_)/1e6;
  const Lbrut=L+2*g.surcoteParCote_mm,lbrut=l_+2*g.surcoteParCote_mm;
  const surfBruteMDF=(Lbrut*lbrut)/1e6;
  const TYPES_CLIPABLES = ["parquet","stratifie","vinyle_rigide"];
  const matiere = {
    nom: tp.matiereType==="parquet" ? "Parquet" : tp.matiereType==="stratifie" ? "Stratifié" : tp.matiereType==="vinyle_rigide" ? "Vinyle rigide" : "Vinyle souple",
    type: TYPES_CLIPABLES.includes(tp.matiereType) ? "rigide_clipable" : "souple",
    longueurLame: tp.lameL || 1900,
    largeurLame:  tp.lamel || 185,
    tempsParCoupe_sec: (params.tempsCoupeMatiere?.[tp.matiereType]) || tp.tempsCoupe || 15,
  };
  const lignes=[],nom={mdf:null,matiere:null,colleOsama:0,colleBlanc:0,chant:0,etiquettes:0,emballages:[],palettes:0,lames:null};
  let totMO=0,totMach=0,totAchat=0;

  const mdfRefRaw=p.mdfPlaques.find(m=>String(m.id)===String(tp.mdfRefId))||p.mdfPlaques[0];
  // S'assurer que les dimensions sont bien des numbers (protection contre NaN/string)
  const mdfRef={...mdfRefRaw, L:+mdfRefRaw.L||2440, l:+mdfRefRaw.l||1220, prix:+mdfRefRaw.prix||0, marge:+mdfRefRaw.marge||20};
  if (tp.supportMDF!=="sans") {
    if (tp.supportMDF==="plein") {
      const row=t.debitMDF_table.find(r=>surfBruteMDF<=r.surfaceMax)||t.debitMDF_table[t.debitMDF_table.length-1];
      const o1=Math.floor(mdfRef.L/Lbrut)*Math.floor(mdfRef.l/lbrut);
      const o2=Math.floor(mdfRef.L/lbrut)*Math.floor(mdfRef.l/Lbrut);
      const nbrParPlaque=Math.max(1, o1>=o2 ? o1 : o2);
      const nbrPlaques=Math.ceil(qty/nbrParPlaque);
      const coutMDF=nbrPlaques*mdfRef.prix*(1+mdfRef.marge/100);
      nom.mdf={type:"plein",nb:nbrPlaques,ref:mdfRef.nom,cout:coutMDF,nbrParPlaque};
      const cMO=(row.sec/3600)*p.tarifsMO.production,cMach=(row.sec/3600)*p.tarifsMachines.gabbiani;
      lignes.push({etape:`Débit MDF – ${mdfRef.nom}`,tMO_unit:row.sec,tMach_unit:row.sec,cMO,cMach,cAchat:coutMDF/qty,detail:`${nbrPlaques} plaques (${nbrParPlaque}/plaque)`});
      totMO+=cMO;totMach+=cMach;totAchat+=coutMDF/qty;
    } else {
      const nbLattes = tp.lattesParPanneau || 3;
      const latteL = tp.latteL || 400;  // mm
      const lattel = tp.lattel || 60;   // mm
      const lattesParPlaque = Math.floor(mdfRef.L / latteL) * Math.floor(mdfRef.l / lattel);
      const nbrPlaquesLattes = Math.ceil((nbLattes * qty) / Math.max(1, lattesParPlaque));
      const coutLMDF = nbrPlaquesLattes * mdfRef.prix * (1 + mdfRef.marge / 100);
      const mlLattes = (nbLattes * latteL) / 1000; // ml de lattes par panneau
      const tDebitLatte = nbLattes * t.debitLattes_sec_ml * (latteL / 1000);
      nom.mdf = { type:"lattes", nbLattes, latteL, lattel, mlParPanneau: mlLattes, ref: mdfRef.nom, cout: coutLMDF };
      const cMO_dl = (tDebitLatte/3600)*p.tarifsMO.production, cMach_dl = (tDebitLatte/3600)*p.tarifsMachines.gabbiani;
      lignes.push({etape:`Débit MDF lattes – ${mdfRef.nom}`,tMO_unit:tDebitLatte,tMach_unit:tDebitLatte,
        cMO:cMO_dl,cMach:cMach_dl,cAchat:coutLMDF/qty,
        detail:`${nbLattes} lattes ${latteL}×${lattel}mm/pann. · ${nbrPlaquesLattes} plaques total`});
      totMO+=cMO_dl; totMach+=cMach_dl; totAchat+=coutLMDF/qty;
      const tCollageLatte = nbLattes * 15;
      const cMO_cl = (tCollageLatte/3600)*p.tarifsMO.production*2;
      lignes.push({etape:"Collage lattes OSAMA (2 op.)",tMO_unit:tCollageLatte,tMach_unit:tCollageLatte,
        cMO:cMO_cl,cMach:(tCollageLatte/3600)*p.tarifsMachines.osama,cAchat:0,
        detail:`${nbLattes} lattes × 15s × 2 opérateurs`});
      totMO+=cMO_cl; totMach+=(tCollageLatte/3600)*p.tarifsMachines.osama;
    }
  }

  const isBatonRompu = !!tp.batonRompu;

  if (isBatonRompu) {
    // Formule bâton rompu :
    // Si lameL >= l/√2 : la lame traverse la largeur → on base sur l (largeur panneau)
    // Si lameL <  l/√2 : la lame ne traverse pas    → on base sur L (hauteur panneau)
    const seuilBaton = l_ / Math.sqrt(2);
    const dimBaton = matiere.longueurLame >= seuilBaton ? l_ : L;
    const nbLamesBaton = 2 * Math.ceil(dimBaton * Math.sqrt(2) / matiere.largeurLame) - 1;
    const surfConsommeeMm2 = nbLamesBaton * matiere.largeurLame * matiere.longueurLame; // mm²
    const surfFinieM2 = surfFinie; // déjà en m²
    const perteBaton = Math.max(0, (surfConsommeeMm2/1e6 - surfFinieM2) / surfFinieM2);
    nom.matiere = {
      ref: matiere.nom,
      surfaceRectoUnit: surfConsommeeMm2 / 1e6,   // m²
      surfaceVersoUnit: rv ? surfConsommeeMm2 / 1e6 : 0,
      surfaceTotale: (surfConsommeeMm2 / 1e6) * nbFaces * qty,
      pertePctRecto: perteBaton,
      pertePctVerso: perteBaton,
      nbLamesBaton,
      modeBaton: true,
    };
    nom.lames = { nbParPanneau: nbLamesBaton * nbFaces, total: nbLamesBaton * nbFaces * qty, lameL: matiere.longueurLame, lamel: matiere.largeurLame, modeBaton: true };
    lignes.push({etape:"Découpe matière (Gabbiani)",tMO_unit:0,tMach_unit:0,cMO:0,cMach:0,cAchat:0,
      detail:`Bâton rompu — 0 coupe Gabbiani · ${nbLamesBaton} lames entières à 45° · CNC détourage obligatoire`});
    const tCollageBaton = nbLamesBaton * 15 * nbFaces;
    const cMO_cb = (tCollageBaton / 3600) * p.tarifsMO.production;
    lignes.push({etape:`Collage lames bâton rompu ×${nbFaces}`,tMO_unit:tCollageBaton,tMach_unit:0,cMO:cMO_cb,cMach:0,cAchat:0,
      detail:`${nbLamesBaton} lames × 15s × ${nbFaces} face${nbFaces>1?"s":""}`});
    totMO += cMO_cb;

  } else {
    const nbCoupesR = calepRecto?.totalPieces||0;
    const nbCoupesV = rv ? (calepVerso?.totalPieces||0) : 0;
    const nbCoupesTotal = nbCoupesR + nbCoupesV;
    const tPC = matiere.tempsParCoupe_sec||12;
    const tCoupeTotal = nbCoupesTotal * tPC;
    const hasCentrage = calepRecto?.needsCentrage || calepVerso?.needsCentrage;
    if (hasCentrage) {
      const tRip = tPC * 1.5;
      const cMO_r=(tRip/3600)*p.tarifsMO.production, cMach_r=(tRip/3600)*p.tarifsMachines.gabbiani;
      lignes.push({etape:"Rip cut centrage (Gabbiani)",tMO_unit:tRip,tMach_unit:tRip,cMO:cMO_r,cMach:cMach_r,cAchat:0,
        detail:`Coupe longit. → 2×${calepRecto?.demiLameLargeur?.toFixed(0)||"?"}mm bord`});
      totMO+=cMO_r; totMach+=cMach_r;
    }
    const longueurLameMatiere = matiere.longueurLame;
    const pertePctR = calepRecto ? (() => {
      const mmU = calepRecto.rangees.reduce((s,r)=>s+r.pieces.reduce((ss,p)=>ss+p.longueur,0),0);
      const mmT = calepRecto.totalLames * longueurLameMatiere;
      return mmT > 0 ? Math.max(0, (mmT - mmU) / Math.max(mmU, 1)) : 0.15;
    })() : 0.15;
    const pertePctV = calepVerso ? (() => {
      const mmU = calepVerso.rangees.reduce((s,r)=>s+r.pieces.reduce((ss,p)=>ss+p.longueur,0),0);
      const mmT = calepVerso.totalLames * longueurLameMatiere;
      return mmT > 0 ? Math.max(0, (mmT - mmU) / Math.max(mmU, 1)) : 0.15;
    })() : 0.15;
    nom.matiere = {ref:matiere.nom,surfaceRectoUnit:surfFinie*(1+pertePctR),surfaceVersoUnit:rv?surfFinie*(1+pertePctV):0,surfaceTotale:(surfFinie*(1+pertePctR)+(rv?surfFinie*(1+pertePctV):0))*qty,pertePctRecto:pertePctR,pertePctVerso:pertePctV};
    const nbLamesR = calepRecto?.totalLames || 0;
    const nbLamesV = rv ? (calepVerso?.totalLames || 0) : 0;
    nom.lames = { nbParPanneau: nbLamesR + nbLamesV, total: (nbLamesR + nbLamesV) * qty, lameL: matiere.longueurLame, lamel: matiere.largeurLame, modeBaton: false };
    const cMO_c=(tCoupeTotal/3600)*p.tarifsMO.production, cMach_c=(tCoupeTotal/3600)*p.tarifsMachines.gabbiani;
    lignes.push({etape:"Découpe matière (Gabbiani)",tMO_unit:tCoupeTotal,tMach_unit:tCoupeTotal,cMO:cMO_c,cMach:cMach_c,cAchat:0,
      detail:`${tPC}s/coupe · R:${nbCoupesR}${rv?" V:"+nbCoupesV:""} coupes`});
    totMO+=cMO_c; totMach+=cMach_c;
  }

  if (tp.clipsage && !tp.collageManuel) {
    const tC=t.clipsage_sec*nbFaces, cMO=(tC/3600)*p.tarifsMO.production;
    lignes.push({etape:`Clipsage ×${nbFaces}`,tMO_unit:tC,tMach_unit:0,cMO,cMach:0,cAchat:0,detail:""});
    totMO+=cMO;
  }

  if (tp.collageManuel) {
    const perim_ml = 2 * (L + l_) / 1000;              // ml (périmètre complet)
    const perim_total_ml = perim_ml * nbFaces;          // ml × faces
    const consoG = perim_total_ml * p.colleBlanc.consoG_ml; // g (consoG_ml = g/ml)
    const cAchat = consoG * p.colleBlanc.prix / 1000;   // €
    nom.colleBlanc += consoG / 1000 * qty;              // kg nomenclature
    const secParMl = t.colleBlanc_sec_ml || 20;
    const tPose = perim_total_ml * secParMl;            // s de pose colle
    const tClips = tp.clipsage ? (t.clipsage_sec * nbFaces) : 0; // s clipsage si activé
    const tTotal = tPose + tClips;
    const cMO = (tTotal/3600) * p.tarifsMO.production;
    const label = `Colle blanche + pose ×${nbFaces}${tp.clipsage?" + clipsage":""}`;
    lignes.push({etape:label, tMO_unit:tTotal, tMach_unit:0, cMO, cMach:0, cAchat,
      detail:`2×(${L}+${l_})=${fmt(perim_ml*1000,0)}mm · ${fmt(consoG,1)}g · ${secParMl}s/ml${tp.clipsage?` + ${t.clipsage_sec}s clip`:""}`});
    totMO+=cMO; totAchat+=cAchat;
  }

  const osamaOff=tp.supportMDF==="sans"&&tp.clipsage&&tp.collageManuel;
  if (tp.encollageOsama&&!osamaOff) {
    const tOs=t.encodageOsama_sec*nbFaces;
    const consoKg=(surfBruteMDF*nbFaces*p.colleOsama.consoG_m2)/1000;
    const cColle=consoKg*p.colleOsama.prix;
    nom.colleOsama+=consoKg*qty;
    const cMO=(tOs/3600)*p.tarifsMO.production*2,cMach=(tOs/3600)*p.tarifsMachines.osama;
    lignes.push({etape:`Encollage OSAMA ×${nbFaces} (2 op.)`,tMO_unit:tOs,tMach_unit:tOs,cMO,cMach,cAchat:cColle,detail:`${fmt(surfBruteMDF*nbFaces,4)}m² MDF · ${fmt(consoKg*1000,0)}g`});
    totMO+=cMO;totMach+=cMach;totAchat+=cColle;
  }

  if (tp.detourage) {
    const dt=t.detorage,mT=tp.cnc5axes?p.tarifsMachines.cnc5:p.tarifsMachines.cnc3;
    const majorBaton = isBatonRompu ? 1.2 : 1.0;
    let tDet=(dt.tempsFixe_sec+((2*(L+l_))/dt.vitesseFraisage_mm_min)*60)*majorBaton;
    if (tp.options?.poignee)       tDet+=dt.poignee_sec;
    if (tp.options?.chanfrein)     tDet+=dt.chanfrein_sec;
    if (tp.options?.coinsArrondis) tDet+=dt.coinsArrondis_sec;
    if (tp.options?.encoches)      tDet+=dt.encoches_sec;
    const opts=[tp.options?.poignee&&"Poignée",tp.options?.chanfrein&&"Chanfrein",tp.options?.coinsArrondis&&"Coins arr.",tp.options?.encoches&&"Encoches"].filter(Boolean).join(", ");
    const cMO=(tDet/3600)*p.tarifsMO.production,cMach=(tDet/3600)*mT;
    lignes.push({etape:`Détourage CNC ${tp.cnc5axes?"5ax":"3ax"}${isBatonRompu?" +20%":""}`,tMO_unit:tDet,tMach_unit:tDet,cMO,cMach,cAchat:0,detail:opts||(isBatonRompu?"contour bâton rompu":"contour seul")});
    totMO+=cMO;totMach+=cMach;
  }

  if (tp.chant&&!tp.options?.chanfrein&&!tp.options?.coinsArrondis) {
    const chRef=p.chants.find(c=>c.id===tp.chantRefId)||p.chants[0];
    const pm=2*(L+l_+4*g.surcoteParCote_mm)/1000,pmMaj=pm*(1+chRef.majoration/100);
    const tCh=(pm/t.chantVitesse_m_min)*60+t.chantTempsFixe_sec;
    const cChant=pmMaj*chRef.prix*(1+chRef.marge/100);
    nom.chant=pmMaj*qty;
    const cMO=(tCh/3600)*p.tarifsMO.production*2,cMach=(tCh/3600)*p.tarifsMachines.plaqueuse;
    lignes.push({etape:"Pose chant (plaqueuse, 2 op.)",tMO_unit:tCh,tMach_unit:tCh,cMO,cMach,cAchat:cChant,detail:`${fmt(pmMaj,2)}ml/pann.`});
    totMO+=cMO;totMach+=cMach;totAchat+=cChant;
  }

  if (tp.etiquette) {
    const nf=tp.facesEtiquetees||1;
    const tE=(t.etiquette_sec+t.controleNettoyage_sec)*nf;
    const cMO=(tE/3600)*p.tarifsMO.production;
    const cEtiq=tp.etiquetteFournie?0:p.etiquettes[0].prix*nf*(1+p.etiquettes[0].marge/100);
    if (!tp.etiquetteFournie) nom.etiquettes+=nf;
    lignes.push({etape:"Étiquetage / nettoyage",tMO_unit:tE,tMach_unit:0,cMO,cMach:0,cAchat:cEtiq,detail:`${nf} face${nf>1?"s":""}${tp.etiquetteFournie?" – fournie client":""}`});
    totMO+=cMO;totAchat+=cEtiq;
  }

  if (tp.palette) {
    const palRef=p.palettes.find(p2=>p2.id===tp.paletteType)||p.palettes[0];
    const panPal=tp.panneauxParPalette||10;
    nom.palettes=Math.ceil(qty/panPal);
    const cPal=(palRef.prix*(1+palRef.marge/100))/panPal;
    const tCerc=t.cerclage_sec_palette/panPal;
    const cMO=(tCerc/3600)*p.tarifsMO.logistique;
    lignes.push({etape:"Palette + cerclage",tMO_unit:tCerc,tMach_unit:0,cMO,cMach:0,cAchat:cPal,detail:`${nom.palettes} palettes`});
    totMO+=cMO;totAchat+=cPal;
  }

  if (tp.emballages?.length) {
    let cEmb=0;
    tp.emballages.forEach(e=>{const ref=p.emballages.find(r=>r.id===e.id);if(ref){const c=ref.prix*(1+ref.marge/100)*(e.qte||1);cEmb+=c;nom.emballages.push({nom:ref.nom,qte:e.qte,cout:c});}});
    if(cEmb>0){lignes.push({etape:"Emballages",tMO_unit:0,tMach_unit:0,cMO:0,cMach:0,cAchat:cEmb,detail:""});totAchat+=cEmb;}
  }

  const CRU=totMO+totMach+totAchat;
  const margePct=tp.margePct||30;
  const PV=CRU/(1-margePct/100);
  const margeAbs=PV-CRU,margeReel=(margeAbs/PV)*100;
  const CA=PV*qty;
  const statutMarge=margeReel>=params.generaux.seuilVert?"vert":margeReel>=params.generaux.seuilOrange?"orange":"rouge";
  return{lignes,nomenclature:nom,totMO,totMach,totAchat,CRU,PV,margePct,margeAbs,margeReel,CA,qty,statutMarge};
}

function calculerDevisComplet(devisForm, typePanneaux, params, calepinages) {
  const resultatsTypes = typePanneaux.map((tp, i) => {
    const {recto, verso} = calepinages[i] || {};
    return calculerType(tp, params, recto, verso);
  });

  const CATotal = resultatsTypes.reduce((s,r) => s + r.CA, 0);
  const CRUTotal = resultatsTypes.reduce((s,r) => s + r.CRU * r.qty, 0);
  const qtyTotal = typePanneaux.reduce((s,tp) => s + (tp.quantite||0), 0);

  // Nb de références = panneauxParKit × nbFaces (1 réf = 1 face unique dans le kit)
  const nbFacesTotal = typePanneaux.reduce((s,tp) => s + (tp.rectoVerso ? 2 : 1), 0);
  const pannParKit2 = typePanneaux[0]?.panneauxParPalette || 1;
  const nbReferences = pannParKit2 * nbFacesTotal;

  let pickingLigne = null;
  let pickingCA = 0;
  if (devisForm.kitting) {
    const tPicking = params.temps.picking_sec * qtyTotal; // sec total
    const cPickingMO = (tPicking / 3600) * params.tarifsMO.logistique;
    const pannParKit = typePanneaux[0]?.panneauxParPalette || 1;
    const nbKits = pannParKit > 0 ? Math.ceil(qtyTotal / pannParKit) : qtyTotal;
    pickingLigne = { tTotal: tPicking, cMO: cPickingMO, qtyTotal, pannParKit, nbKits,
      tParKit: params.temps.picking_sec * pannParKit };
    const margeMoyenne = resultatsTypes.reduce((s,r) => s + r.margePct * r.CA, 0) / (CATotal || 1);
    const pvPicking = cPickingMO / (1 - margeMoyenne / 100);
    pickingCA = pvPicking;
  }

  const tBE = params.temps.priseInfo_min * 60;
  const cBE = (params.temps.priseInfo_min / 60) * params.tarifsMO.be;
  const margeMoyenneBE = resultatsTypes.reduce((s,r) => s + r.margePct * r.CA, 0) / (CATotal || 1);
  const pvBE = cBE / (1 - margeMoyenneBE / 100);
  const beLigne = { tTotal: tBE, cMO: cBE, pvBE, label: "Prise info / BE" };

  const CAKit = CATotal + pickingCA + pvBE;

  return { resultatsTypes, CATotal, CRUTotal, CAKit, qtyTotal, pickingLigne, pickingCA, beLigne, cBE, pvBE, nbReferences, nbFacesTotal };
}

function optimiserMDF(typePanneaux, params) {
  const g = params.generaux;
  const result = [];

  for (const tp of typePanneaux) {
    if (tp.supportMDF === "sans") continue;
    const mdfRefRaw2 = params.mdfPlaques.find(m => String(m.id) === String(tp.mdfRefId)) || params.mdfPlaques[0];
    const mdfRef = {...mdfRefRaw2, L:+mdfRefRaw2.L||2440, l:+mdfRefRaw2.l||1220, prix:+mdfRefRaw2.prix||0, marge:+mdfRefRaw2.marge||20};
    const qty = tp.quantite || 1;

    if (tp.supportMDF === "plein") {
      const Lb = tp.dimensionL + 2*g.surcoteParCote_mm;
      const lb = tp.dimensionl + 2*g.surcoteParCote_mm;
      const o1_nx = Math.floor(mdfRef.L / Lb), o1_ny = Math.floor(mdfRef.l / lb);
      const o1 = o1_nx * o1_ny;
      const o2_nx = Math.floor(mdfRef.L / lb), o2_ny = Math.floor(mdfRef.l / Lb);
      const o2 = o2_nx * o2_ny;
      const best = o1 >= o2
        ? { nx: o1_nx, ny: o1_ny, piecesParPlaque: Math.max(1,o1), pieceL: Lb, piecel: lb, rotation: false }
        : { nx: o2_nx, ny: o2_ny, piecesParPlaque: Math.max(1,o2), pieceL: lb, piecel: Lb, rotation: true };
      const nbPlaques = Math.ceil(qty / best.piecesParPlaque);
      result.push({ tp, mdfRef, type:"plein", qty, best, nbPlaques,
        coutTotal: nbPlaques * mdfRef.prix * (1 + mdfRef.marge/100) });

    } else { // lattes
      const latteL = tp.latteL || 400, lattel = tp.lattel || 60;
      const nbLattes = tp.lattesParPanneau || 3;
      const o1_nx = Math.floor(mdfRef.L / latteL), o1_ny = Math.floor(mdfRef.l / lattel);
      const o1 = o1_nx * o1_ny;
      const o2_nx = Math.floor(mdfRef.L / lattel), o2_ny = Math.floor(mdfRef.l / latteL);
      const o2 = o2_nx * o2_ny;
      const best = o1 >= o2
        ? { nx: o1_nx, ny: o1_ny, piecesParPlaque: Math.max(1,o1), pieceL: latteL, piecel: lattel, rotation: false }
        : { nx: o2_nx, ny: o2_ny, piecesParPlaque: Math.max(1,o2), pieceL: lattel, piecel: latteL, rotation: true };
      const totalLattes = nbLattes * qty;
      const nbPlaques = Math.ceil(totalLattes / best.piecesParPlaque);
      result.push({ tp, mdfRef, type:"lattes", qty, best, nbPlaques, nbLattes, totalLattes,
        coutTotal: nbPlaques * mdfRef.prix * (1 + mdfRef.marge/100) });
    }
  }
  return result;
}

function SvgMDF({ optMDF }) {
  if(!optMDF||!optMDF.length) return null;
  return(
    <div>
      {optMDF.map((item,i)=>{
        const {tp,mdfRef,type,best,nbPlaques,coutTotal,totalLattes,qty}=item;
        const {nx,ny,piecesParPlaque,pieceL,piecel,rotation}=best;
        const col=TYPE_COLORS[i%TYPE_COLORS.length];
        const VW=480,VH=260,PAD=22;
        const scale=Math.min((VW-PAD*2)/mdfRef.L,(VH-PAD*2-20)/mdfRef.l);
        const pw=mdfRef.L*scale,ph=mdfRef.l*scale;
        const ox=(VW-pw)/2,oy=PAD;
        const sw=pieceL*scale,sh=piecel*scale;
        const taux=Math.round(piecesParPlaque*pieceL*piecel/(mdfRef.L*mdfRef.l)*100);
        const derniere=type==="lattes"
          ?((totalLattes-(nbPlaques-1)*piecesParPlaque+piecesParPlaque)%piecesParPlaque||piecesParPlaque)
          :((qty-(nbPlaques-1)*piecesParPlaque+piecesParPlaque)%piecesParPlaque||piecesParPlaque);
        return(
          <Card key={i} style={{marginBottom:16}}>
            <STitle style={{color:col}}>{tp.nom} — MDF {type==="plein"?"plein":"lattes"}</STitle>
            <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
              {[
                [String(nbPlaques),"Plaques MDF",mdfRef.nom,col],
                [String(piecesParPlaque),"Par plaque",type==="lattes"?"lattes":"panneaux",G.green],
                [taux+"%","Utilisation",rotation?"Rotat. 90°":"Sens normal",G.accent2],
                [fmtE(coutTotal),"Coût MDF",fmtE(mdfRef.prix)+"/plaque",G.red],
                [String(derniere),"Dernière plaque",(type==="lattes"?"lattes":"pann.")+" / "+piecesParPlaque,G.purple],
              ].map(([v,l,s,c])=>(
                <div key={l} style={{padding:"8px 12px",background:G.surfaceAlt,borderRadius:6,minWidth:80}}>
                  <div style={{fontSize:10,color:G.textMuted,textTransform:"uppercase",marginBottom:2}}>{l}</div>
                  <div style={{fontSize:18,fontWeight:800,fontFamily:"DM Mono",color:c}}>{v}</div>
                  <div style={{fontSize:11,color:G.textMuted}}>{s}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:11,color:G.textMuted,marginBottom:6}}>
              Disposition sur 1 plaque {mdfRef.L}×{mdfRef.l}mm
              {rotation&&<span style={{color:G.orange,marginLeft:8}}>↻ pièces pivotées 90°</span>}
            </div>
            <svg viewBox={"0 0 "+VW+" "+VH} style={{width:"100%",maxWidth:500,display:"block",background:"#0a0c12",borderRadius:8,border:"1px solid "+G.border}}>
              <rect x={ox} y={oy} width={pw} height={ph} fill="#1a1d28" stroke={G.border} strokeWidth={1.5}/>
              {Array.from({length:ny},(_,row)=>
                Array.from({length:nx},(_,col2)=>{
                  const px2=ox+col2*sw, py2=oy+row*sh;
                  if(px2+sw>ox+pw+0.5||py2+sh>oy+ph+0.5) return null;
                  const idx=row*nx+col2;
                  const isUsed=idx<piecesParPlaque;
                  return(
                    <g key={row+"-"+col2}>
                      <rect x={px2+1} y={py2+1} width={sw-2} height={sh-2}
                        fill={isUsed?col:"transparent"} fillOpacity={isUsed?0.35:0}
                        stroke={isUsed?col:G.border} strokeWidth={isUsed?1.2:0.5}
                        strokeOpacity={0.7} rx={2}/>
                      {isUsed&&sw>25&&sh>12&&(
                        <text x={px2+sw/2} y={py2+sh/2+3} textAnchor="middle"
                          fill={col} fontSize={Math.min(8,sh*0.4)} fontFamily="DM Mono" fontWeight="600">
                          {type==="lattes"?(pieceL+"×"+piecel):(tp.dimensionL+"×"+tp.dimensionl)}
                        </text>
                      )}
                    </g>
                  );
                })
              )}
              <text x={ox+pw/2} y={oy-5} textAnchor="middle" fill={G.textMuted} fontSize={8} fontFamily="DM Mono">{mdfRef.L}mm</text>
              <text x={ox+pw+4} y={oy+ph/2+3} textAnchor="start" fill={G.textMuted} fontSize={8} fontFamily="DM Mono">{mdfRef.l}mm</text>
              <text x={VW/2} y={VH-3} textAnchor="middle" fill={G.textDim} fontSize={7} fontFamily="DM Mono">
                {nx}×{ny} = {piecesParPlaque} pièces/plaque · {nbPlaques} plaques pour {type==="lattes"?totalLattes+" lattes":qty+" panneaux"}
              </text>
            </svg>
          </Card>
        );
      })}
    </div>
  );
}

function genererCDC(devisForm, typePanneaux, params, calepinages, global) {
  const {resultatsTypes, CAKit, qtyTotal, pickingLigne} = global;
  const L = [];

  L.push("╔═══════════════════════════════════════════════════════════════════╗");
  L.push("║           CDC PRODUCTION — CHIFFRAGE INDUSTRIEL v6               ║");
  L.push("╚═══════════════════════════════════════════════════════════════════╝");
  L.push(`Référence   : ${devisForm.reference||"—"}   |   Client : ${devisForm.client||"—"}`);
  L.push(`Commercial  : ${devisForm.commercial||"—"}   |   Date   : ${new Date().toLocaleDateString("fr-FR")}`);
  L.push(`Kit         : ${devisForm.kitting?"OUI – Picking inclus":"NON – Livraison palette"}`);
  if(devisForm.nbReferences>0) L.push(`Références  : ${devisForm.nbReferences} décors/faces distincts`);
  L.push(`Nb types    : ${typePanneaux.length}   |   Qté totale : ${qtyTotal} panneaux`);

  L.push("");
  L.push("═══════════════════════════════════════════════════════════════════");
  L.push("SYNTHÈSE KIT");
  L.push("═══════════════════════════════════════════════════════════════════");
  L.push(`  ${"Type"} ${"Qté"} ${"CRU unit."} ${"PV HT unit."} ${"CA HT"} Marge`);
  L.push(`  ${"─".repeat(70)}`);
  for (let i=0;i<typePanneaux.length;i++) {
    const tp=typePanneaux[i],r=resultatsTypes[i];
    L.push(`  ${tp.nom} ${String(tp.quantite)} ${fmt(r.CRU)} ${fmt(r.PV)} ${fmt(r.CA)} ${fmt(r.margePct)}%`);
  }
  if (pickingLigne) {
    L.push(`  ${"─".repeat(70)}`);
    L.push(`  ${"Picking kit"} ${String(qtyTotal)} ${""} ${""} ${fmt(global.pickingCA)} (MO log.)`);
  }
  L.push(`  ${"─".repeat(70)}`);
  L.push(`  Prise info / BE (dossier) : CRU ${fmtE(global.cBE||0)}  →  PV ${fmtE(global.pvBE||0)} (margé ${fmt((global.pvBE||0)>0?((global.pvBE-global.cBE)/global.pvBE*100):0)}%)`);
  const optMDFcdc = optimiserMDF(typePanneaux, params);
  if (optMDFcdc.length > 0) {
    L.push("");
    L.push("  ── COMMANDE MDF");
    for (const item of optMDFcdc) {
      L.push(`  ${item.tp.nom} ${item.type==="plein"?"Plein ":"Lattes"} · ${item.mdfRef.nom} → ${String(item.nbPlaques).padStart(3)} plaques  (${item.best.piecesParPlaque}/${item.best.piecesParPlaque} p/plq · ${Math.round(item.best.piecesParPlaque*item.best.pieceL*item.best.piecel/(item.mdfRef.L*item.mdfRef.l)*100)}% util.)`);
    }
    L.push(`  TOTAL MDF : ${optMDFcdc.reduce((s,i)=>s+i.nbPlaques,0)} plaques — ${fmtE(optMDFcdc.reduce((s,i)=>s+i.coutTotal,0))}`);
  }
  L.push(`  TOTAL KIT    ${qtyTotal} panneaux    CA HT : ${fmtE(CAKit)}    TTC : ${fmtE(CAKit*1.2)}`);
  L.push(`  (dont BE/Admin : ${fmtE(global.pvBE||0)} HT)`);
  if (pickingLigne) L.push(`  Temps picking : ${fmtH(pickingLigne.tTotal)} (${pickingLigne.qtyTotal} pann. × ${params.temps.picking_sec}s)`);

  for (let i=0;i<typePanneaux.length;i++) {
    const tp=typePanneaux[i],r=resultatsTypes[i];
    const {recto,verso}=calepinages[i]||{};
    const matiere={ nom: tp.matiereType||"parquet", longueurLame:tp.lameL||1900, largeurLame:tp.lamel||185, tempsParCoupe_sec:(params.tempsCoupeMatiere?.[tp.matiereType]) || tp.tempsCoupe || 15 };
    const rv=tp.rectoVerso;

    L.push("");
    L.push(`${"╔"+"═".repeat(65)+"╗"}`);
    L.push(`║ TYPE ${String(i+1)} – ${tp.nom}║`);
    L.push(`${"╚"+"═".repeat(65)+"╝"}`);
    L.push(`  Dimensions : ${tp.dimensionL}×${tp.dimensionl}mm   Qté : ${tp.quantite}   Faces : ${rv?"Recto-verso":"Recto"}`);
    L.push(`  Matière    : ${matiere.nom} (${matiere.tempsParCoupe_sec}s/coupe)`);
    L.push(`  Calepinage : Recto ${tp.calepinageRecto} (${tp.offsetPctRecto}%)${rv?` / Verso ${tp.calepinageVerso} (${tp.offsetPctVerso}%)`:""}`)

    if (tp.batonRompu) {
      const mat2={ longueurLame:tp.lameL||1900, largeurLame:tp.lamel||185 };
      const seuilBaton2 = tp.dimensionl / Math.sqrt(2);
      const dimBaton2 = mat2.longueurLame >= seuilBaton2 ? tp.dimensionl : tp.dimensionL;
      const nbL = 2 * Math.ceil(dimBaton2 * Math.sqrt(2) / mat2.largeurLame) - 1;
      const sc=nbL*mat2.largeurLame*mat2.longueurLame;
      const perte=Math.round((sc-tp.dimensionL*tp.dimensionl)/(tp.dimensionL*tp.dimensionl)*100);
      L.push("");
      L.push(`  ── PATTERN BÂTON ROMPU (chevron 45°)`);
      L.push(`  Lames posées entières à 45° · V centré · Détourage CNC obligatoire`);
      L.push(`  ${nbL} lames × ${mat2.largeurLame}×${mat2.longueurLame}mm · Perte ~${perte}%`);
      L.push(`  Gabbiani : 0 coupe`);
    } else {
      const faces=rv
        ?[{label:"RECTO",calep:recto,type:tp.calepinageRecto},{label:"VERSO",calep:verso,type:tp.calepinageVerso}]
        :[{label:"RECTO",calep:recto,type:tp.calepinageRecto}];
      for (const face of faces) {
        if (!face.calep) continue;
        L.push("");
        L.push(`  ── PATTERN ${face.label} (${face.type})`);
        for (const rg of face.calep.rangees) {
          const ps=rg.pieces.map(p=>`${p.id}(${p.longueur}mm)`).join(" + ");
          const typeRangee = rg.estDecale ? `décalée ${rg.decalage}mm` : "droite  ";
          L.push(`    R${String(rg.num).padStart(2,"0")} [${typeRangee}] : ${ps}`);
        }
      }
    }

    if (!tp.batonRompu) {
      const bConsolide={};
      const addB=(calep,label)=>{if(!calep)return;for(const b of calep.besoins){if(!bConsolide[b.mm])bConsolide[b.mm]={mm:b.mm,nbR:0,nbV:0};if(label==="R")bConsolide[b.mm].nbR+=b.nbParPanneau;else bConsolide[b.mm].nbV+=b.nbParPanneau;}};
      addB(recto,"R");if(rv)addB(verso,"V");
      const bTab=Object.values(bConsolide).sort((a,b2)=>b2.mm-a.mm);
      L.push("");
      L.push("  ── FEUILLE DE DÉBIT GABBIANI");
      L.push(`  ${"Longueur"} ${rv?"Recto/p  Verso/p  ":""}${"Total/p"} Total ×${tp.quantite}`);
      let totCoupesPann=0;
      for (const b of bTab) {
        const nbTot=b.nbR+(rv?b.nbV:0);totCoupesPann+=nbTot;
        L.push(`  ${(b.mm+" mm")} ${rv?String(b.nbR)+String(b.nbV):""}${String(nbTot)} ${nbTot*tp.quantite}`);
      }
      L.push(`  Total : ${totCoupesPann}/panneau × ${tp.quantite} = ${totCoupesPann*tp.quantite} coupes  (${fmtH(totCoupesPann*matiere.tempsParCoupe_sec)}/panneau)`);
      if (recto?.needsCentrage) L.push(`  Centrage actif : 1 rip cut Gabbiani → 2 demi-lames (${recto.demiLameLargeur?.toFixed(0)}mm) en bord`);
    }

    L.push("");
    L.push("  ── CHIFFRAGE DÉTAILLÉ (unitaire)");
    L.push(`  ${"Étape"} ${"€MO"} ${"€Mach"} ${"€Achat"} Total`);
    for (const lg of r.lignes) {
      const tot=lg.cMO+lg.cMach+lg.cAchat;
      L.push(`  ${lg.etape.substring(0,39)} ${fmt(lg.cMO)} ${fmt(lg.cMach)} ${fmt(lg.cAchat)} ${fmt(tot)} €`);
      if (lg.detail) L.push(`    ↳ ${lg.detail}`);
    }
    L.push(`  ${"─".repeat(80)}`);
    L.push(`  CRU : ${fmtE(r.CRU)}   PV : ${fmtE(r.PV)}   Marge : ${fmt(r.margePct)}%   CA : ${fmtE(r.CA)}`);
  }

  L.push("");
  L.push("═══════════════════════════════════════════════════════════════════");
  L.push(`Généré le ${new Date().toLocaleDateString("fr-FR")} — Chiffrage Industriel v6`);
  return L.join("\n");
}

function buildGmailLink(to, subject, body) {
  const base = "https://mail.google.com/mail/?view=cm";
  const params = [
    to    ? `to=${encodeURIComponent(to)}`         : "",
    `su=${encodeURIComponent(subject)}`,
    `body=${encodeURIComponent(body)}`,
  ].filter(Boolean).join("&");
  return `${base}&${params}`;
}
function buildMailInterne(devisForm, global, params) {
  const c=params.commerciaux.find(c=>c.nom===devisForm.commercial)||{};
  const sub=`[DEVIS INTERNE] ${devisForm.reference||"Nouveau"} – ${devisForm.client||"Client"}`;
  const lignes=global.resultatsTypes.map((r,i)=>`Type ${i+1}: ${r.qty} pann. | CRU:${fmt(r.CRU)}€ PV:${fmt(r.PV)}€`).join("\n");
  const body=`DEVIS ${devisForm.reference||"—"} – ${devisForm.client||"—"}\n${devisForm.commercial} (${c.email||""})\nKit: ${devisForm.kitting?"OUI":"NON"} | Qté totale: ${global.qtyTotal}\n\n${lignes}\n\nCA KIT TOTAL: ${fmt(global.CAKit)} € HT\nTTC: ${fmt(global.CAKit*1.2)} €`;
  return buildGmailLink(params.emailInterne, sub, body);
}
function buildMailClient(devisForm, typePanneaux, global, params) {
  const c=params.commerciaux.find(c=>c.nom===devisForm.commercial)||{};
  const fraisParPanneau = ((global.pvBE||0)+(global.pickingCA||0)) / global.qtyTotal;
  const sub=`Devis N° ${devisForm.reference||"—"} — ${devisForm.client||"—"}`;

  // Détail par type avec prix frais inclus
  const lignesTypes = devisForm.kitting
    ? [`Kit complet – ${global.qtyTotal} panneaux`,
       ...typePanneaux.map(tp=>`  · ${tp.quantite}× ${tp.nom} (${tp.dimensionL}×${tp.dimensionl}mm)`),
       `  Matière fournie par vos soins · Pose + kitting inclus`]
    : typePanneaux.map((tp,i)=>{
        const r=global.resultatsTypes[i];
        const pv=r.PV+fraisParPanneau;
        const ca=pv*tp.quantite;
        return `  · ${tp.nom} — ${tp.quantite} pann. × ${pv.toFixed(2).replace(".",",")} € = ${ca.toFixed(2).replace(".",",")} € HT`;
      });

  const body = [
    `Madame, Monsieur,`,
    ``,
    `Nous avons le plaisir de vous adresser notre offre de prix pour votre projet de panneaux de présentation.`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `  DEVIS N° ${devisForm.reference||"—"}  `,
    `  ${new Date().toLocaleDateString("fr-FR")}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    ...lignesTypes,
    ``,
    `──────────────────────────────`,
    `  Total HT    :  ${fmt(global.CAKit)} €`,
    `  TVA 20%     :  ${fmt(global.CAKit*0.2)} €`,
    `  Total TTC   :  ${fmt(global.CAKit*1.2)} €`,
    `──────────────────────────────`,
    ``,
    `Ce devis est établi hors fourniture matière (fournie par vos soins).`,
    `Devis valable 30 jours. Paiement à 30 jours fin de mois.`,
    ``,
    `Pour toute question, n'hésitez pas à nous contacter.`,
    ``,
    `Cordialement,`,
    ``,
    `${devisForm.commercial}`,
    `${c.email||""}`,
    `FANDI — Générateur de solutions`,
  ].join("\n");

  return buildGmailLink(devisForm.clientEmail||"", sub, body);
}

function genererPDFDevis(devisForm, typePanneaux, params, global) {
  const {resultatsTypes, CAKit, qtyTotal, pickingCA, pvBE} = global;
  const date = new Date().toLocaleDateString("fr-FR");
  const comm = params.commerciaux.find(c=>c.nom===devisForm.commercial)||{};
  const fraisParPanneau = ((pvBE||0)+(pickingCA||0)) / qtyTotal;
  const pvAjuste = (r) => r.PV + fraisParPanneau;
  const caAjuste = (r,tp) => pvAjuste(r) * tp.quantite;
  const fmtE2 = n => n.toFixed(2).replace(".",",")+" €";
  const couleurs = ["#D4860A","#1E4FBF","#1A7A4A","#7B3DB5","#C0392B","#0E7490"];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',Arial,sans-serif;font-size:11.5px;color:#1C1C1C;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .page{max-width:210mm;margin:0 auto;background:#fff}
    /* Bandeau haut */
    .topbar{background:#1C1C1C;padding:18px 32px;display:flex;justify-content:space-between;align-items:center}
    .brand{font-family:'Playfair Display',Georgia,serif;font-size:26px;color:#fff;letter-spacing:.5px}
    .brand span{color:#E8A020}
    .brand-sub{font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.15em;margin-top:3px}
    .devis-badge{background:#E8A020;color:#1C1C1C;font-weight:700;font-size:11px;padding:6px 18px;border-radius:2px;text-transform:uppercase;letter-spacing:.1em}
    /* Barre accent */
    .accent-bar{height:4px;background:linear-gradient(90deg,#E8A020 0%,#F0C050 50%,#E8A020 100%)}
    /* Corps principal */
    .body{padding:28px 32px}
    /* Méta devis */
    .meta{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px}
    .meta-ref{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px}
    .meta-num{font-size:20px;font-weight:700;color:#1C1C1C;letter-spacing:-.3px}
    .meta-date{font-size:11px;color:#666;margin-top:3px}
    /* Infos grid */
    .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;margin-bottom:28px;border:1px solid #E8E8E8;border-radius:4px;overflow:hidden}
    .info-box{padding:16px 20px;background:#FAFAFA}
    .info-box:first-child{border-right:1px solid #E8E8E8;background:#fff}
    .info-label{font-size:8.5px;font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:#E8A020;margin-bottom:8px}
    .info-name{font-size:14px;font-weight:700;color:#1C1C1C;margin-bottom:4px}
    .info-detail{font-size:10.5px;color:#666;line-height:1.6}
    .info-email{color:#1E4FBF;font-size:10.5px}
    /* Objet */
    .objet{background:#FEF9EC;border-left:3px solid #E8A020;padding:10px 16px;margin-bottom:24px;font-size:11px;color:#444;line-height:1.5}
    .objet strong{color:#1C1C1C}
    /* Table */
    table{width:100%;border-collapse:collapse;margin-bottom:0}
    .table-wrap{border:1px solid #E8E8E8;border-radius:4px;overflow:hidden;margin-bottom:24px}
    thead tr{background:#1C1C1C}
    th{padding:11px 16px;text-align:left;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#ccc}
    th.right{text-align:right}
    td{padding:14px 16px;border-bottom:1px solid #F3F3F3;vertical-align:middle}
    tr:last-child td{border-bottom:none}
    tr:nth-child(even) td{background:#FAFAFA}
    .td-right{text-align:right;font-family:'Courier New',monospace;font-weight:600;font-size:12px}
    .td-total{text-align:right;font-family:'Courier New',monospace;font-weight:700;font-size:13px;color:#1C1C1C}
    .item-name{font-weight:600;font-size:12.5px;color:#1C1C1C;margin-bottom:3px;display:flex;align-items:center;gap:8px}
    .item-dot{width:9px;height:9px;border-radius:2px;display:inline-block;flex-shrink:0}
    .item-sub{font-size:10px;color:#888;line-height:1.5;margin-top:1px}
    .item-badge{display:inline-block;padding:1px 7px;border-radius:10px;font-size:8.5px;font-weight:600;margin-top:5px}
    /* Totaux */
    .totaux-wrap{display:flex;justify-content:flex-end;margin-bottom:24px}
    .totaux{width:240px}
    .tot-row{display:flex;justify-content:space-between;padding:8px 16px;font-size:11.5px;border-bottom:1px solid #F3F3F3}
    .tot-row span:last-child{font-family:'Courier New',monospace;font-weight:600}
    .tot-row.muted span:first-child{color:#888}
    .tot-final{display:flex;justify-content:space-between;padding:12px 16px;background:#1C1C1C;color:#fff;font-weight:700;font-size:14px;border-radius:0 0 4px 4px}
    .tot-final span:last-child{color:#E8A020;font-family:'Courier New',monospace}
    /* Conditions */
    .conds{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#E8E8E8;border:1px solid #E8E8E8;border-radius:4px;overflow:hidden;margin-bottom:24px}
    .cond{background:#fff;padding:10px 14px;font-size:10px;color:#555;line-height:1.4}
    .cond strong{color:#1C1C1C;display:block;margin-bottom:1px}
    /* Signature */
    .sig-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
    .sig-box{border:1px solid #E8E8E8;border-radius:4px;padding:16px 20px}
    .sig-label{font-size:8.5px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#888;margin-bottom:16px}
    .sig-line{border-bottom:1px solid #E8E8E8;height:36px;margin-bottom:6px}
    .sig-hint{font-size:9px;color:#bbb}
    /* Footer */
    .footer{background:#F8F8F8;border-top:1px solid #E8E8E8;padding:12px 32px;display:flex;justify-content:space-between;align-items:center}
    .footer-brand{font-size:10px;font-weight:700;color:#1C1C1C}
    .footer-brand span{color:#E8A020}
    .footer-info{font-size:9px;color:#999;text-align:right}
    @media print{
      body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
      .page{max-width:100%}
      @page{margin:0;size:A4}
    }`;

  let html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<title>Devis ${devisForm.reference||"—"} — ${devisForm.client||"—"}</title>
<style>${css}</style></head><body><div class="page">`;

  // TOP BAR
  html += `<div class="topbar">
    <div>
      <div class="brand"><span>f</span>andi</div>
      <div class="brand-sub">Générateur de solutions</div>
    </div>
    <div class="devis-badge">Devis</div>
  </div>
  <div class="accent-bar"></div>`;

  // BODY
  html += `<div class="body">`;

  // META
  html += `<div class="meta">
    <div>
      <div class="meta-ref">Référence</div>
      <div class="meta-num">N° ${devisForm.reference||"—"}</div>
      <div class="meta-date">Émis le ${date}</div>
    </div>
  </div>`;

  // INFO GRID
  html += `<div class="info-grid">
    <div class="info-box">
      <div class="info-label">Destinataire</div>
      <div class="info-name">${devisForm.client||"—"}</div>
      ${devisForm.clientEmail?`<div class="info-email">${devisForm.clientEmail}</div>`:""}
      ${devisForm.commentaire?`<div class="info-detail" style="margin-top:6px">${devisForm.commentaire}</div>`:""}
    </div>
    <div class="info-box">
      <div class="info-label">Établi par</div>
      <div class="info-name">${devisForm.commercial||"—"}</div>
      <div class="info-email">${comm.email||""}</div>
      <div class="info-detail" style="margin-top:6px">FANDI · Générateur de solutions<br>Carvin, Hauts-de-France</div>
    </div>
  </div>`;

  // OBJET
  const objetStr = devisForm.kitting
    ? `Kit de panneaux de présentation — ${qtyTotal} panneaux · ${typePanneaux.length} type${typePanneaux.length>1?"s":""}`
    : typePanneaux.map(tp=>`${tp.quantite}× ${tp.nom} (${tp.dimensionL}×${tp.dimensionl}mm)`).join(" · ");
  html += `<div class="objet"><strong>Objet :</strong> ${objetStr}<br>Matière fournie par vos soins · Façonnage et finition sur site Fandi</div>`;

  // TABLE
  html += `<div class="table-wrap"><table>
    <thead><tr>
      <th>Désignation</th>
      <th class="right">Qté</th>
      <th class="right">Prix unit. HT</th>
      <th class="right">Total HT</th>
    </tr></thead><tbody>`;

  if (devisForm.kitting) {
    const pvKit = CAKit / qtyTotal;
    html += `<tr>
      <td>
        <div class="item-name">Kit panneaux de présentation</div>
        <div class="item-sub">${typePanneaux.map(tp=>`${tp.quantite}× ${tp.nom} — ${tp.dimensionL}×${tp.dimensionl}mm`).join("<br>")}</div>
        <div class="item-sub" style="margin-top:4px">Matière fournie · Pose complète + kitting inclus</div>
        ${typePanneaux.some(tp=>tp.nbReferences>1)?`<div class="item-sub">${typePanneaux.map(tp=>`${tp.nbReferences||1} réf. ${tp.nom}`).join(" · ")}</div>`:""}
        <span class="item-badge" style="background:#FEF3CD;color:#9A6700">Kit complet</span>
      </td>
      <td class="td-right">${qtyTotal}</td>
      <td class="td-right">${fmtE2(pvKit)}</td>
      <td class="td-total">${fmtE2(CAKit)}</td>
    </tr>`;
  } else {
    typePanneaux.forEach((tp,i) => {
      const r = resultatsTypes[i];
      const pv = pvAjuste(r);
      const ca = caAjuste(r,tp);
      const col = couleurs[i%couleurs.length];
      const modeStr = tp.batonRompu?"Bâton rompu 45°":tp.calepinageRecto==="classique"?"Calepinage classique":"Calepinage anglaise";
      const detailRows = r.lignes.map(lg=>{
        const tot=(lg.cMO+lg.cMach+lg.cAchat).toFixed(2).replace(".",",");
        return `<tr style="background:#FAFAFA">
          <td style="padding:5px 12px 5px 28px;font-size:9.5px;color:#555;border-bottom:1px solid #F3F3F3">${lg.etape}${lg.detail?` <span style="color:#AAA">— ${lg.detail}</span>`:""}</td>
          <td style="padding:5px 12px;text-align:right;font-family:monospace;font-size:9.5px;color:#777;border-bottom:1px solid #F3F3F3">${lg.tMO_unit>0?(()=>{const s=lg.tMO_unit;const m=Math.floor(s/60),sc=Math.round(s%60);return m>0?m+"m"+String(sc).padStart(2,"0")+"s":sc+"s";})():"—"}</td>
          <td style="padding:5px 12px;text-align:right;font-family:monospace;font-size:9.5px;color:#777;border-bottom:1px solid #F3F3F3">${lg.cMO>0?lg.cMO.toFixed(2).replace(".",",")+" €":"—"}</td>
          <td style="padding:5px 12px;text-align:right;font-family:monospace;font-size:9.5px;color:#777;border-bottom:1px solid #F3F3F3">${lg.cAchat>0?lg.cAchat.toFixed(2).replace(".",",")+" €":"—"}</td>
          <td style="padding:5px 12px;text-align:right;font-family:monospace;font-size:9.5px;font-weight:600;color:#444;border-bottom:1px solid #F3F3F3">${tot} €</td>
        </tr>`;
      }).join("");
      html += `<tr>
        <td>
          <div class="item-name">
            <span class="item-dot" style="background:${col}"></span>
            ${tp.nom}
          </div>
          <div class="item-sub">${tp.dimensionL}×${tp.dimensionl}mm · ${modeStr}${tp.rectoVerso?" · Recto-verso":""}</div>
          <div class="item-sub">Matière fournie client</div>
          ${tp.nbReferences>1?`<div class="item-sub">${tp.nbReferences} références distinctes</div>`:""}
          <span class="item-badge" style="background:${col}18;color:${col}">Façonnage Fandi</span>
        </td>
        <td class="td-right">${tp.quantite}</td>
        <td class="td-right">${fmtE2(pv)}</td>
        <td class="td-total">${fmtE2(ca)}</td>
      </tr>
      <tr>
        <td colspan="5" style="padding:0;border-bottom:2px solid #E8E8E8">
          <table style="width:100%;border-collapse:collapse;margin:0">
            <thead><tr style="background:#F3F3F3">
              <th style="padding:5px 12px 5px 28px;text-align:left;font-size:8.5px;color:#999;font-weight:600;text-transform:uppercase;letter-spacing:.08em">Étape</th>
              <th style="padding:5px 12px;text-align:right;font-size:8.5px;color:#999;font-weight:600;text-transform:uppercase">t MO</th>
              <th style="padding:5px 12px;text-align:right;font-size:8.5px;color:#999;font-weight:600;text-transform:uppercase">€ MO</th>
              <th style="padding:5px 12px;text-align:right;font-size:8.5px;color:#999;font-weight:600;text-transform:uppercase">€ Achat</th>
              <th style="padding:5px 12px;text-align:right;font-size:8.5px;color:#999;font-weight:600;text-transform:uppercase">Total/pann.</th>
            </tr></thead>
            <tbody>${detailRows}</tbody>
            <tfoot>
              <tr style="background:#FEF9EC">
                <td colspan="3" style="padding:6px 12px 6px 28px;font-size:9.5px;color:#888">CRU unitaire · + frais BE/admin : ${fraisParPanneau.toFixed(2).replace(".",",")} €</td>
                <td style="padding:6px 12px;text-align:right;font-size:9px;color:#888;font-family:monospace">${r.CRU.toFixed(2).replace(".",",")} €</td>
                <td style="padding:6px 12px;text-align:right;font-weight:700;font-size:11px;color:#D4860A;font-family:monospace">${fmtE2(pv)}</td>
              </tr>
            </tfoot>
          </table>
        </td>
      </tr>`;
    });
  }
  html += `</tbody></table></div>`;

  // TOTAUX
  html += `<div class="totaux-wrap"><div class="totaux">
    <div style="border:1px solid #E8E8E8;border-radius:4px 4px 0 0;overflow:hidden">
      <div class="tot-row muted"><span>Total HT</span><span>${fmtE2(CAKit)}</span></div>
      <div class="tot-row muted"><span>TVA 20 %</span><span>${fmtE2(CAKit*0.2)}</span></div>
    </div>
    <div class="tot-final"><span>Total TTC</span><span>${fmtE2(CAKit*1.2)}</span></div>
  </div></div>`;

  // CONDITIONS
  html += `<div class="conds">
    <div class="cond"><strong>Validité</strong>30 jours à compter de l'émission</div>
    <div class="cond"><strong>Paiement</strong>30 jours fin de mois</div>
    <div class="cond"><strong>Matière</strong>Fournie par vos soins</div>
    <div class="cond"><strong>Fabrication</strong>Sur site Fandi, Carvin</div>
    <div class="cond"><strong>Accord</strong>Bon pour accord signé requis</div>
    <div class="cond"><strong>Prix</strong>Hors taxes, en euros</div>
  </div>`;

  // SIGNATURES
  html += `<div class="sig-grid">
    <div class="sig-box">
      <div class="sig-label">Bon pour accord — Client</div>
      <div class="sig-line"></div>
      <div class="sig-hint">Signature, date et cachet obligatoires</div>
    </div>
    <div class="sig-box">
      <div class="sig-label">Établi par</div>
      <div style="font-weight:700;font-size:13px;margin-bottom:3px">${devisForm.commercial||"—"}</div>
      <div style="font-size:10.5px;color:#1E4FBF">${comm.email||""}</div>
      <div style="font-size:9px;color:#999;margin-top:8px">FANDI · Générateur de solutions · ${date}</div>
    </div>
  </div>`;

  html += `</div>`; // end .body

  // FOOTER
  html += `<div class="footer">
    <div class="footer-brand"><span>f</span>andi — Générateur de solutions</div>
    <div class="footer-info">Devis N° ${devisForm.reference||"—"} · ${date} · ${devisForm.client||"—"}</div>
  </div>`;

  html += `</div></body></html>`;
  return html;
}

function ouvrirPDFDevis(devisForm, typePanneaux, params, global) {
  const html = genererPDFDevis(devisForm, typePanneaux, params, global);
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;border:none;z-index:99999;background:#fff";
  document.body.appendChild(iframe);
  iframe.contentDocument.open();
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕ Fermer";
  closeBtn.style.cssText = "position:fixed;top:12px;right:12px;z-index:100000;background:#1C1C1C;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer";
  closeBtn.onclick = () => { document.body.removeChild(iframe); document.body.removeChild(closeBtn); document.body.removeChild(printBtn); };
  const printBtn = document.createElement("button");
  printBtn.textContent = "🖨 Imprimer / PDF";
  printBtn.style.cssText = "position:fixed;top:12px;right:130px;z-index:100000;background:#E8A020;color:#000;border:none;padding:8px 16px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer";
  printBtn.onclick = () => iframe.contentWindow.print();
  document.body.appendChild(closeBtn);
  document.body.appendChild(printBtn);
}

function genererFicheADV(devisForm, typePanneaux, params, calepinages, global) {
  const {resultatsTypes, CAKit, qtyTotal} = global;
  const date = new Date().toLocaleDateString("fr-FR");

  const couleurs = ["#e8a020","#3b82f6","#22c55e","#a855f7","#ef4444","#06b6d4"];

  // Génère le SVG calepinage inline pour un calep donné
  const svgCalep = (calep, label) => {
    if (!calep) return "";
    const W=480, mL=36, mT=14, rH=20, gap=2;
    const totalH = calep.rangees.length*(rH+gap)+mT+20;
    const scale = W/calep.longueurRangee;
    const colorMap = {};
    let ci = 0;
    const COLS = ["#e8a020","#3b82f6","#22c55e","#a855f7","#ef4444","#06b6d4","#f59e0b","#10b981"];
    for (const r of calep.rangees) for (const p of r.pieces) if (!colorMap[p.lettre]) colorMap[p.lettre]=COLS[ci++%COLS.length];

    let rects = "";
    for (let ri=0; ri<calep.rangees.length; ri++) {
      const r = calep.rangees[ri];
      const y = mT + ri*(rH+gap);
      rects += `<text x="${mL-4}" y="${y+rH/2+3}" text-anchor="end" fill="#64748b" font-size="6" font-family="monospace">R${String(r.num).padStart(2,"0")}</text>`;
      for (const p of r.pieces) {
        const px = mL+p.debut*scale, pw = (p.fin-p.debut)*scale;
        const col = colorMap[p.lettre];
        const isDemi = !!p.isDemi;
        rects += `<rect x="${px+0.5}" y="${y+0.5}" width="${pw-1}" height="${rH-1}" fill="${col}" fill-opacity="${isDemi?0.3:0.2}" stroke="${col}" stroke-width="${isDemi?1.5:1}" rx="2" ${isDemi?'stroke-dasharray="4,2"':""}/>`;
        if (pw>20) rects += `<text x="${px+pw/2}" y="${y+rH/2+3}" text-anchor="middle" fill="${col}" font-size="${pw>35?7:5.5}" font-family="monospace" font-weight="600">${p.id}</text>`;
      }
    }
    return `
      <div style="margin-bottom:8px">
        <div style="font-size:10px;font-weight:700;color:#e8a020;text-transform:uppercase;margin-bottom:4px">${label||""}</div>
        <svg viewBox="0 0 ${W+mL+10} ${totalH}" style="width:100%;background:#f8fafc;border-radius:4px;border:1px solid #e2e8f0">
          <text x="${(W+mL)/2}" y="10" text-anchor="middle" fill="#94a3b8" font-size="7" font-family="monospace">${calep.longueurRangee}mm · ${calep.rangees.length} rangées · offset ${calep.offsetPct}%</text>
          ${rects}
          <line x1="${mL}" y1="${totalH-8}" x2="${mL+W}" y2="${totalH-8}" stroke="#e2e8f0" stroke-width="1"/>
          <text x="${mL}" y="${totalH-1}" fill="#94a3b8" font-size="6" font-family="monospace">0</text>
          <text x="${mL+W}" y="${totalH-1}" fill="#94a3b8" font-size="6" font-family="monospace" text-anchor="end">${calep.longueurRangee}mm</text>
        </svg>
      </div>`;
  };

  let html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<title>Fiche ADV — ${devisForm.reference||"Devis"}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #1e293b; background: #fff; }
  .page { max-width: 210mm; margin: 0 auto; padding: 16mm 14mm; }
  h1 { font-size: 20px; font-weight: 700; color: #1e293b; }
  h2 { font-size: 13px; font-weight: 700; color: #e8a020; text-transform: uppercase; letter-spacing: .06em; margin: 18px 0 8px; padding-bottom: 4px; border-bottom: 2px solid #e8a020; }
  h3 { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .05em; margin: 12px 0 6px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 11px; }
  th { background: #f1f5f9; padding: 6px 8px; text-align: left; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: #64748b; border-bottom: 2px solid #e2e8f0; }
  td { padding: 5px 8px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  .mono { font-family: 'Courier New', monospace; font-weight: 600; }
  .accent { color: #e8a020; }
  .green { color: #16a34a; }
  .red { color: #dc2626; }
  .blue { color: #2563eb; }
  .muted { color: #64748b; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 3px solid #e8a020; }
  .header-right { text-align: right; color: #64748b; font-size: 11px; line-height: 1.6; }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; }
  .kpi { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px; }
  .kpi-label { font-size: 9px; text-transform: uppercase; letter-spacing: .07em; color: #94a3b8; margin-bottom: 3px; }
  .kpi-val { font-size: 18px; font-weight: 700; font-family: 'Courier New', monospace; color: #e8a020; }
  .kpi-sub { font-size: 10px; color: #94a3b8; margin-top: 1px; }
  .type-header { display: flex; align-items: center; gap: 8px; margin: 16px 0 8px; padding: 8px 12px; border-radius: 6px; }
  .dot { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; }
  .conso-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 12px; }
  .conso-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 5px; padding: 8px 10px; }
  .conso-card-label { font-size: 9px; text-transform: uppercase; color: #94a3b8; margin-bottom: 3px; }
  .conso-card-val { font-size: 15px; font-weight: 700; font-family: 'Courier New', monospace; }
  .conso-card-sub { font-size: 10px; color: #64748b; margin-top: 1px; }
  .tfoot-row td { background: #f1f5f9; font-weight: 700; border-top: 2px solid #e2e8f0; }
  @media print {
    body { font-size: 11px; }
    .page { padding: 10mm 10mm; }
    .no-print { display: none; }
    @page { margin: 10mm; size: A4; }
  }
</style></head><body><div class="page">`;

  // HEADER
  html += `<div class="header">
    <div>
      <div style="font-size:22px;font-weight:800;color:#e8a020;margin-bottom:4px">■ FANDI</div>
      <div style="font-size:11px;color:#64748b">Générateur de solutions</div>
    </div>
    <div class="header-right">
      <div style="font-size:16px;font-weight:700;color:#1e293b">FICHE DE FABRICATION ADV</div>
      <div>Réf. <b>${devisForm.reference||"—"}</b></div>
      <div>Client : <b>${devisForm.client||"—"}</b></div>
      <div>Commercial : ${devisForm.commercial||"—"}</div>
      <div>Date : ${date}</div>
    </div>
  </div>`;

  // KPIS
  html += `<div class="kpis">
    <div class="kpi"><div class="kpi-label">CA Kit HT</div><div class="kpi-val accent">${CAKit.toFixed(2).replace(".",",")} €</div><div class="kpi-sub">${qtyTotal} panneaux</div></div>
    <div class="kpi"><div class="kpi-label">CRU total</div><div class="kpi-val">${global.CRUTotal.toFixed(2).replace(".",",")} €</div><div class="kpi-sub">Coût revient</div></div>
    <div class="kpi"><div class="kpi-label">Types</div><div class="kpi-val">${typePanneaux.length}</div><div class="kpi-sub">${typePanneaux.map(tp=>tp.quantite).join("+")} pann.</div></div>
    <div class="kpi"><div class="kpi-label">Mode</div><div class="kpi-val" style="font-size:13px">${devisForm.kitting?"KIT":"PALETTE"}</div><div class="kpi-sub">${devisForm.kitting?"Picking inclus":"Livraison palette"}</div></div>
  </div>`;

  // PAR TYPE
  for (let i=0; i<typePanneaux.length; i++) {
    const tp = typePanneaux[i];
    const r = resultatsTypes[i];
    const nom = r.nomenclature;
    const col = couleurs[i%couleurs.length];
    const calep = calepinages[i];

    html += `<div class="type-header" style="background:${col}15;border-left:4px solid ${col}">
      <div class="dot" style="background:${col}"></div>
      <div style="font-size:14px;font-weight:700">${tp.nom}</div>
      <div style="font-size:11px;color:#64748b;margin-left:4px">${tp.dimensionL}×${tp.dimensionl}mm · ${tp.quantite} panneaux${tp.rectoVerso?" · R/V":""}</div>
      <div style="margin-left:auto"><span class="badge" style="background:${col}20;color:${col}">${r.margePct.toFixed(1)}% marge</span></div>
    </div>`;

    // TEMPS MO / MACHINE
    html += `<h3>⏱ Temps de fabrication</h3>
    <table>
      <thead><tr><th>Étape</th><th>Détail</th><th>t MO</th><th>t Machine</th><th>€ MO</th><th>€ Machine</th><th>€ Achat</th><th>Total</th></tr></thead>
      <tbody>`;
    let totMO=0, totMach=0, totAchat=0;
    for (const lg of r.lignes) {
      const tot = lg.cMO+lg.cMach+lg.cAchat;
      totMO+=lg.cMO; totMach+=lg.cMach; totAchat+=lg.cAchat;
      const fmtS = s => { if(!s&&s!==0)return"—"; const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sc=Math.round(s%60); if(h>0)return`${h}h${String(m).padStart(2,"0")}m`; if(m>0)return`${m}m${String(sc).padStart(2,"0")}s`; return`${sc}s`; };
      const fmtE = n => n>0?`${n.toFixed(2).replace(".",",")} €`:"—";
      html += `<tr><td style="font-weight:600">${lg.etape}</td><td class="muted" style="font-size:10px">${lg.detail||""}</td><td class="mono">${fmtS(lg.tMO_unit)}</td><td class="mono">${fmtS(lg.tMach_unit)}</td><td class="mono">${fmtE(lg.cMO)}</td><td class="mono">${fmtE(lg.cMach)}</td><td class="mono">${fmtE(lg.cAchat)}</td><td class="mono accent" style="font-weight:700">${fmtE(tot)}</td></tr>`;
    }
    html += `</tbody><tfoot><tr class="tfoot-row"><td colspan="4">TOTAL UNITAIRE</td><td class="mono">${totMO.toFixed(2).replace(".",",")} €</td><td class="mono">${totMach.toFixed(2).replace(".",",")} €</td><td class="mono">${totAchat.toFixed(2).replace(".",",")} €</td><td class="mono accent">${r.CRU.toFixed(2).replace(".",",")} €</td></tr></tfoot></table>`;

    // CONSO MATIÈRE
    html += `<h3>📦 Consommation matière</h3><div class="conso-grid">`;
    if (nom.mdf) {
      html += `<div class="conso-card"><div class="conso-card-label">🪵 MDF</div><div class="conso-card-val">${nom.mdf.nb||nom.mdf.nbLattes} ${nom.mdf.type==="plein"?"plaques":"lattes/pann."}</div><div class="conso-card-sub">${nom.mdf.ref}</div></div>`;
    }
    if (nom.matiere) {
      html += `<div class="conso-card"><div class="conso-card-label">🪵 Matière</div><div class="conso-card-val">${nom.matiere.surfaceTotale.toFixed(4)} m²</div><div class="conso-card-sub">Perte ~${(nom.matiere.pertePctRecto*100).toFixed(0)}%</div></div>`;
    }
    if (nom.lames) {
      const nref = tp.nbReferences||1;
      html += `<div class="conso-card"><div class="conso-card-label">🪵 Lames</div><div class="conso-card-val">${nom.lames.total}</div><div class="conso-card-sub">${nom.lames.nbParPanneau}/panneau · ${Math.ceil(nom.lames.total/nref)}/réf.</div></div>`;
    }
    if (nom.colleOsama>0) html += `<div class="conso-card"><div class="conso-card-label">🧴 Colle OSAMA</div><div class="conso-card-val">${(nom.colleOsama*1000).toFixed(0)} g</div><div class="conso-card-sub">${nom.colleOsama.toFixed(3)} kg</div></div>`;
    if (nom.colleBlanc>0) html += `<div class="conso-card"><div class="conso-card-label">🧴 Colle blanche</div><div class="conso-card-val">${(nom.colleBlanc*1000).toFixed(0)} g</div><div class="conso-card-sub">${nom.colleBlanc.toFixed(3)} kg</div></div>`;
    if (nom.chant>0) html += `<div class="conso-card"><div class="conso-card-label">🔲 Chant ABS</div><div class="conso-card-val">${nom.chant.toFixed(2)} ml</div><div class="conso-card-sub">${(nom.chant/tp.quantite).toFixed(2)} ml/panneau</div></div>`;
    if (nom.etiquettes>0) html += `<div class="conso-card"><div class="conso-card-label">🏷 Étiquettes</div><div class="conso-card-val">${nom.etiquettes*tp.quantite}</div><div class="conso-card-sub">${tp.etiquetteL||"?"}×${tp.etiquettel||"?"}mm · ${nom.etiquettes}/pann.</div></div>`;
    if (nom.palettes>0) html += `<div class="conso-card"><div class="conso-card-label">📦 Palettes</div><div class="conso-card-val">${nom.palettes}</div><div class="conso-card-sub">${tp.panneauxParPalette} pann./palette</div></div>`;
    html += `</div>`;

    // SVG CALEPINAGE
    if (!tp.batonRompu && calep) {
      html += `<h3>🔲 Calepinage</h3>`;
      if (calep.recto) html += svgCalep(calep.recto, tp.rectoVerso?"RECTO":"");
      if (calep.verso && tp.rectoVerso) html += svgCalep(calep.verso, "VERSO");
    }

    html += `<div style="border-bottom:1px solid #e2e8f0;margin:16px 0"></div>`;
  }

  // PIED DE PAGE
  html += `<div style="text-align:center;color:#94a3b8;font-size:10px;margin-top:12px">
    Fiche générée le ${date} · Chiffrage Panneaux Fandi · ${devisForm.reference||"—"} · ${devisForm.client||"—"}
  </div>`;

  html += `</div></body></html>`;
  return html;
}

function imprimerFicheADV(devisForm, typePanneaux, params, calepinages, global) {
  const html = genererFicheADV(devisForm, typePanneaux, params, calepinages, global);
  // Créer une iframe cachée et déclencher l'impression
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;border:none;z-index:99999;background:#fff";
  document.body.appendChild(iframe);
  iframe.contentDocument.open();
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();
  // Bouton fermer
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕ Fermer";
  closeBtn.style.cssText = "position:fixed;top:12px;right:12px;z-index:100000;background:#1C1C1C;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer";
  closeBtn.onclick = () => { document.body.removeChild(iframe); document.body.removeChild(closeBtn); document.body.removeChild(printBtn); };
  // Bouton imprimer
  const printBtn = document.createElement("button");
  printBtn.textContent = "🖨 Imprimer / PDF";
  printBtn.style.cssText = "position:fixed;top:12px;right:130px;z-index:100000;background:#E8A020;color:#000;border:none;padding:8px 16px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer";
  printBtn.onclick = () => iframe.contentWindow.print();
  document.body.appendChild(closeBtn);
  document.body.appendChild(printBtn);
}

function SvgCalepinage({ calep, label }) {
  const {rangees,longueurRangee,offsetMm,offsetPct}=calep;
  const W=560,mL=40,mT=16,rH=22,gap=3;
  const totalH=rangees.length*(rH+gap)+mT+24;
  const scale=W/longueurRangee;
  const colorMap={};let ci=0;
  for(const r of rangees)for(const p of r.pieces)if(!colorMap[p.lettre])colorMap[p.lettre]=COLORS[ci++%COLORS.length];
  return (
    <div>
      {label&&<div style={{fontSize:10,color:G.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}}>{label}</div>}
      <svg viewBox={`0 0 ${W+mL+12} ${totalH}`} style={{width:"100%",display:"block",background:G.bg,borderRadius:6}}>
        <text x={(W+mL)/2} y={12} textAnchor="middle" fill={G.textMuted} fontSize={8} fontFamily="DM Mono">{longueurRangee}mm · {rangees.length} rangées · offset {offsetPct}%</text>
        {rangees.map((r,ri)=>{
          const y=mT+ri*(rH+gap);
          return(<g key={r.num}>
            <text x={mL-4} y={y+rH/2+3} textAnchor="end" fill={G.textMuted} fontSize={7} fontFamily="DM Mono">R{String(r.num).padStart(2,"0")}</text>
            {r.pieces.map((p,pi)=>{
              const px=mL+p.debut*scale,pw=(p.fin-p.debut)*scale,col=colorMap[p.lettre];
              const isDemi=!!p.isDemi;
              return(<g key={pi}>
                <rect x={px} y={y} width={pw} height={rH} fill={col} fillOpacity={isDemi?.4:.2} stroke={col} strokeWidth={isDemi?2:1.5} rx={2} strokeDasharray={isDemi?"5,3":undefined}/>
                {isDemi&&<text x={px+pw/2} y={y+6} textAnchor="middle" fill={col} fontSize={6} fontFamily="DM Mono">½</text>}
                {pw>20&&<text x={px+pw/2} y={y+rH/2+3} textAnchor="middle" fill={col} fontSize={pw>38?8:6.5} fontFamily="DM Mono" fontWeight="500">{p.id}</text>}
                {pw>52&&<text x={px+pw/2} y={y+rH-3} textAnchor="middle" fill={col} fontSize={6} fontFamily="DM Mono" opacity={.7}>{p.longueur}</text>}
              </g>);
            })}
            {r.estDecale&&r.decalage>0&&<line x1={mL+r.decalage*scale} y1={y} x2={mL+r.decalage*scale} y2={y+rH} stroke="#fff" strokeOpacity={.15} strokeWidth={1} strokeDasharray="3,2"/>}
          </g>);
        })}
        <line x1={mL} y1={totalH-10} x2={mL+W} y2={totalH-10} stroke={G.border} strokeWidth={1}/>
        <text x={mL} y={totalH-2} fill={G.textMuted} fontSize={6.5} fontFamily="DM Mono">0</text>
        <text x={mL+W} y={totalH-2} fill={G.textMuted} fontSize={6.5} fontFamily="DM Mono" textAnchor="end">{longueurRangee}mm</text>
      </svg>
    </div>
  );
}

function SvgBatonRompu({ tp, params }) {
  const lameL=tp.lameL||1900,lamel=tp.lamel||185,L=tp.dimensionL,l=tp.dimensionl;
  const seuil=l*Math.sqrt(2)/Math.sqrt(2)/Math.sqrt(2); // l/√2
  const dimB = lameL >= l/Math.sqrt(2) ? l : L;
  const nb = 2*Math.ceil(dimB*Math.sqrt(2)/lamel) - 1;
  const sc=nb*lamel*lameL,pct=Math.round((sc-L*l)/(L*l)*100);
  return(<div style={{padding:16,background:G.surfaceAlt,borderRadius:8,border:`1px solid ${G.border}`}}>
    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
      {[["Lames",nb,`${lameL}×${lamel}mm`,G.accent],["Perte",`~${pct}%`,`${(sc/1e6).toFixed(4)}m²`,G.red],["Collage",`${nb*15}s`,`${nb}×15s`,G.green],["Gabbiani","0 coupe","CNC oblig.",G.purple]].map(([l,v,s,c])=>(
        <div key={l} style={{padding:"8px 12px",background:G.surface,borderRadius:6,minWidth:80}}>
          <div style={{fontSize:10,color:G.textMuted,textTransform:"uppercase"}}>{l}</div>
          <div style={{fontSize:17,fontWeight:800,fontFamily:"DM Mono",color:c}}>{v}</div>
          <div style={{fontSize:11,color:G.textMuted}}>{s}</div>
        </div>
      ))}
    </div>
    <div style={{marginTop:12,fontSize:12,color:G.textMuted}}>⚠ Schéma bâton rompu non disponible dans cette version</div>
  </div>);
}

function Btn({children,onClick,variant="primary",small,full,disabled,style}){
  const v={primary:{background:G.accent,color:"#000",border:"none"},ghost:{background:"transparent",color:G.text,border:`1px solid ${G.border}`},blue:{background:"rgba(59,130,246,.15)",color:G.accent2,border:`1px solid rgba(59,130,246,.3)`},green:{background:"rgba(34,197,94,.15)",color:G.green,border:`1px solid rgba(34,197,94,.3)`},danger:{background:"rgba(239,68,68,.15)",color:G.red,border:`1px solid rgba(239,68,68,.3)`},info:{background:"rgba(6,182,212,.15)",color:G.cyan,border:`1px solid rgba(6,182,212,.3)`},purple:{background:"rgba(168,85,247,.15)",color:G.purple,border:`1px solid rgba(168,85,247,.3)`}};
  return <button onClick={onClick} disabled={disabled} style={{...v[variant],padding:small?"5px 12px":"9px 18px",borderRadius:6,fontSize:13,fontWeight:700,width:full?"100%":undefined,opacity:disabled?.4:1,...style}}>{children}</button>;
}
function Card({children,style}){return <div style={{background:G.surface,border:`1px solid ${G.border}`,borderRadius:10,padding:"16px 20px",...style}}>{children}</div>;}
function STitle({children,style}){return <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:G.accent,marginBottom:12,paddingBottom:7,borderBottom:`1px solid ${G.border}`,...style}}>{children}</div>;}
function Field({label,children,hint}){return <div style={{marginBottom:12}}><label style={{display:"block",fontSize:11,color:G.textMuted,marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"}}>{label}</label>{children}{hint&&<div style={{fontSize:11,color:G.textDim,marginTop:3}}>{hint}</div>}</div>;}
function Toggle({value,onChange,label,disabled,disabledReason}){
  return(<div>
    <label style={{display:"flex",alignItems:"center",gap:10,cursor:disabled?"not-allowed":"pointer",userSelect:"none",opacity:disabled?.5:1}}>
      <div onClick={()=>!disabled&&onChange(!value)} style={{width:36,height:19,borderRadius:10,background:value&&!disabled?G.accent:G.border,position:"relative",transition:"background .2s",flexShrink:0}}>
        <div style={{position:"absolute",top:2.5,left:value&&!disabled?18:2.5,width:14,height:14,borderRadius:"50%",background:"#fff",transition:"left .2s"}}/>
      </div>
      <span style={{fontSize:13}}>{label}</span>
    </label>
    {disabled&&disabledReason&&<div style={{fontSize:11,color:G.orange,marginTop:4,marginLeft:46}}>{disabledReason}</div>}
  </div>);
}
function CalepBloc({calepinage,offsetPct,onChange,label}){
  const CALEPS=[{id:"classique",label:"Classique",desc:"30%"},{id:"anglaise",label:"Anglaise",desc:"50%"}];
  const DEF={classique:30,anglaise:50};
  return(
    <div style={{padding:"10px 12px",background:G.surfaceAlt,borderRadius:8,border:`1px solid ${G.border}`}}>
      <div style={{fontSize:10,color:G.accent,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>{label}</div>
      <div style={{display:"flex",gap:6,marginBottom:10}}>
        {CALEPS.map(c=>(
          <div key={c.id} onClick={()=>{onChange("calepinage",c.id);onChange("offsetPct",DEF[c.id]);}}
            style={{border:`2px solid ${calepinage===c.id?G.accent:G.border}`,borderRadius:6,padding:"6px 10px",cursor:"pointer",background:calepinage===c.id?"rgba(232,160,32,.07)":G.bg,flex:1,textAlign:"center"}}>
            <div style={{fontSize:11,fontWeight:700,color:calepinage===c.id?G.accent:G.text}}>{c.label}</div>
            <div style={{fontSize:10,color:G.textMuted}}>{c.desc}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:11,color:G.textMuted,whiteSpace:"nowrap"}}>Offset %</span>
        <input type="number" value={offsetPct} min={10} max={70} onChange={e=>onChange("offsetPct", e.target.value===""?0:+e.target.value)} style={{width:70}}/>
      </div>
    </div>
  );
}
function KpiCard({label,value,sub,color}){
  return(<div style={{background:G.surfaceAlt,borderRadius:8,padding:"12px 15px",border:`1px solid ${G.border}`}}>
    <div style={{fontSize:10,color:G.textMuted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>{label}</div>
    <div style={{fontSize:18,fontWeight:800,color:color||G.text,fontFamily:"DM Mono"}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:G.textDim,marginTop:3}}>{sub}</div>}
  </div>);
}

function TypePanneauForm({ tp, idx, params, onChange, onDuplicate, onDelete, couleur }) {
  const set = (k,v) => onChange({ ...tp, [k]: v });
  const setOpt = (k,v) => {
    const newOpts = { ...tp.options, [k]: v };
    const chantIncompatible = newOpts.chanfrein || newOpts.coinsArrondis;
    onChange({ ...tp, options: newOpts, chant: chantIncompatible ? false : tp.chant });
  };
  const setBaton = (v) => {
    onChange({ ...tp, batonRompu: v, detourage: v ? true : tp.detourage });
  };
  const setChant = (v) => {
    if (v && (tp.options?.chanfrein || tp.options?.coinsArrondis)) return; // bloqué
    set("chant", v);
  };

  const TYPES_CLIPABLES_UI = ["parquet","stratifie","vinyle_rigide"];
  const isClipable = TYPES_CLIPABLES_UI.includes(tp.matiereType||"parquet");
  const osamaOff = tp.supportMDF==="sans"&&tp.clipsage&&tp.collageManuel;
  const mdfRefRaw3 = params.mdfPlaques.find(m=>String(m.id)===String(tp.mdfRefId))||params.mdfPlaques[0];
  const mdfRef = {...mdfRefRaw3, L:+mdfRefRaw3.L||2440, l:+mdfRefRaw3.l||1220};
  const lameInutilisable = (tp.lamel||185) > tp.dimensionl || (tp.lameL||1900) <= params.calepinage.seuilReste;
  const chantBloque = tp.options?.chanfrein||tp.options?.coinsArrondis;

  return (
    <div style={{border:`2px solid ${couleur}44`,borderRadius:12,overflow:"hidden",marginBottom:16}}>
      {/* Header type */}
      <div style={{background:`${couleur}18`,borderBottom:`1px solid ${couleur}33`,padding:"10px 16px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:12,height:12,borderRadius:3,background:couleur,flexShrink:0}}/>
        <input value={tp.nom} onChange={e=>set("nom",e.target.value)}
          style={{background:"transparent",border:"none",fontSize:14,fontWeight:700,color:couleur,width:160,padding:"2px 4px"}}/>
        <div style={{display:"flex",gap:6,marginLeft:"auto"}}>
          <Btn small variant="ghost" onClick={onDuplicate}>⧉ Dupliquer</Btn>
          <Btn small variant="danger" onClick={onDelete}>✕</Btn>
        </div>
      </div>

      <div style={{padding:"16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {/* COL GAUCHE */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {/* Dimensions */}
          <div>
            <div style={{fontSize:11,color:G.textMuted,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Dimensions & quantité</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              <Field label="Long. (mm)"><input type="number" value={tp.dimensionL||""} onChange={e=>set("dimensionL", e.target.value===""?0:+e.target.value)}/></Field>
              <Field label="Larg. (mm)"><input type="number" value={tp.dimensionl||""} onChange={e=>set("dimensionl", e.target.value===""?0:+e.target.value)}/></Field>
              <Field label="Quantité"><input type="number" value={tp.quantite||""} min={1} onChange={e=>set("quantite", e.target.value===""?0:+e.target.value)}/></Field>
              <Field label="Nb références" hint="Designs/coloris différents"><input type="number" value={tp.nbReferences||1} min={1} onChange={e=>set("nbReferences", e.target.value===""?1:+e.target.value)}/></Field>
            </div>
            <div style={{fontSize:11,color:G.textMuted,marginTop:4}}>
              Surface : <b style={{color:G.text,fontFamily:"DM Mono"}}>{((tp.dimensionL*tp.dimensionl)/1e6).toFixed(4)} m²</b>
              {params.tempsCoupeMatiere&&<span style={{marginLeft:12}}>⏱ <b style={{color:G.cyan,fontFamily:"DM Mono"}}>{params.tempsCoupeMatiere[tp.matiereType||"parquet"]}s</b>/coupe</span>}
              {lameInutilisable&&<span style={{color:G.red,marginLeft:8}}>
                {(tp.lamel||185)>tp.dimensionl?"⚠ Lame plus large que le panneau":"⚠ Lame trop courte (seuil de rejet)"}
              </span>}
            </div>
          </div>

          {/* Calepinage */}
          <div>
            <div style={{fontSize:11,color:G.textMuted,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Calepinage</div>
            {/* Toggle bâton rompu */}
            <div style={{marginBottom:10}}>
              <Toggle value={!!tp.batonRompu} onChange={setBaton} label="Bâton rompu (chevron 45°)"/>
              {tp.batonRompu&&<div style={{marginTop:6,padding:"8px 12px",background:"rgba(232,160,32,.07)",border:"1px solid rgba(232,160,32,.2)",borderRadius:6,fontSize:12,color:G.accent}}>
                ⚠ Lames entières à 45° · CNC obligatoire · Perte ~{(()=>{
                  const nb=(()=>{const seuil=tp.dimensionl/Math.sqrt(2);const dim=tp.lameL>=seuil?tp.dimensionl:tp.dimensionL;return 2*Math.ceil(dim*Math.sqrt(2)/(tp.lamel||185))-1;})();
                  const sc=nb*(tp.lamel||185)*(tp.lameL||1900);
                  const sf=tp.dimensionL*tp.dimensionl;
                  return Math.round((sc-sf)/sf*100);
                })()}% · Gabbiani : 0 coupe
              </div>}
            </div>
            {/* Calepinage classique/anglaise uniquement si pas bâton */}
            {!tp.batonRompu&&<>
              <CalepBloc calepinage={tp.calepinageRecto} offsetPct={tp.offsetPctRecto}
                onChange={(k,v)=>set(k==="calepinage"?"calepinageRecto":"offsetPctRecto",v)} label="RECTO"/>
              <div style={{marginTop:8}}>
                <Toggle value={tp.rectoVerso} onChange={v=>set("rectoVerso",v)} label="Recto-verso (calepinage indépendant)"/>
              </div>
              {tp.rectoVerso&&<div style={{marginTop:8}}>
                <CalepBloc calepinage={tp.calepinageVerso} offsetPct={tp.offsetPctVerso}
                  onChange={(k,v)=>set(k==="calepinage"?"calepinageVerso":"offsetPctVerso",v)} label="VERSO"/>
              </div>}
            </>}
            {/* Bâton rompu : recto-verso possible mais même logique */}
            {tp.batonRompu&&<div style={{marginTop:8}}>
              <Toggle value={tp.rectoVerso} onChange={v=>set("rectoVerso",v)} label="Recto-verso (même pattern bâton des 2 côtés)"/>
            </div>}
          </div>

          {/* Matière — saisie libre */}
          <div>
            <div style={{fontSize:11,color:G.textMuted,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Matière (fournie client)</div>
            {/* Type */}
            <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
              {[["parquet","🪵 Parquet"],["stratifie","📋 Stratifié"],["vinyle_rigide","🔷 Vinyle rigide"],["vinyle_souple","🌊 Vinyle souple"]].map(([v,l])=>(
                <button key={v} onClick={()=>set("matiereType",v)} style={{flex:"1 1 auto",padding:"6px 8px",borderRadius:6,border:`1px solid ${(tp.matiereType||"parquet")===v?G.accent:G.border}`,background:(tp.matiereType||"parquet")===v?"rgba(232,160,32,.12)":"transparent",color:(tp.matiereType||"parquet")===v?G.accent:G.textMuted,fontSize:11,fontWeight:700,cursor:"pointer"}}>
                  {l}
                </button>
              ))}
            </div>
            {/* Dimensions lame */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              <Field label="Long. lame (mm)"><input type="number" value={tp.lameL||""} onChange={e=>set("lameL", e.target.value===""?0:+e.target.value)}/></Field>
              <Field label="Larg. lame (mm)"><input type="number" value={tp.lamel||""} onChange={e=>set("lamel", e.target.value===""?0:+e.target.value)}/></Field>

            </div>
            <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
              <span className={`badge-${isClipable?"green":"orange"}`}>{isClipable?"clipable":"non clipable"}</span>
            </div>
          </div>
        </div>

        {/* COL DROITE */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {/* MDF */}
          <div>
            <div style={{fontSize:11,color:G.textMuted,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Support MDF</div>
            <div style={{display:"flex",gap:6,marginBottom:8}}>
              {[["plein","Plein"],["lattes","Lattes"],["sans","Sans"]].map(([v,l])=>(
                <button key={v} onClick={()=>set("supportMDF",v)}
                  style={{flex:1,padding:"7px",borderRadius:6,border:`1px solid ${tp.supportMDF===v?G.accent:G.border}`,background:tp.supportMDF===v?"rgba(232,160,32,.1)":"transparent",color:tp.supportMDF===v?G.accent:G.textMuted,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                  {l}
                </button>
              ))}
            </div>
            {tp.supportMDF!=="sans"&&(
              <select value={String(tp.mdfRefId)} onChange={e=>set("mdfRefId",e.target.value)}>
                {params.mdfPlaques.map(m=><option key={m.id} value={String(m.id)}>{m.nom}</option>)}
              </select>
            )}
            {tp.supportMDF!=="sans"&&mdfRef&&<div style={{fontSize:11,color:G.textMuted,marginTop:4}}>{mdfRef.epaisseur}mm · {mdfRef.L}×{mdfRef.l}mm · {mdfRef.prix}€/plaque</div>}
            {tp.supportMDF==="lattes"&&(
              <div style={{marginTop:8,padding:"10px 12px",background:G.surfaceAlt,borderRadius:7,border:`1px solid ${G.border}`}}>
                <div style={{fontSize:10,color:G.accent,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Dimensions des lattes</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  <Field label="Long. latte (mm)"><input type="number" value={tp.latteL||""} onChange={e=>set("latteL",e.target.value===""?0:+e.target.value)}/></Field>
                  <Field label="Larg. latte (mm)"><input type="number" value={tp.lattel||""} onChange={e=>set("lattel",e.target.value===""?0:+e.target.value)}/></Field>
                  <Field label="Nb lattes/panneau"><input type="number" value={tp.lattesParPanneau||""} min={1} onChange={e=>set("lattesParPanneau",e.target.value===""?0:+e.target.value)}/></Field>
                </div>
                <div style={{fontSize:11,color:G.textMuted,marginTop:4}}>
                  Collage OSAMA : <b style={{color:G.text,fontFamily:"DM Mono"}}>{(tp.lattesParPanneau||3)*15}s</b> × 2 op. par panneau
                </div>
              </div>
            )}
          </div>

          {/* Process */}
          <div>
            <div style={{fontSize:11,color:G.textMuted,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Process assemblage</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <Toggle value={tp.clipsage&&isClipable} onChange={v=>set("clipsage",v&&isClipable)} label="Clipsage" disabled={!isClipable} disabledReason="Matière non clipable"/>
              <Toggle value={tp.collageManuel} onChange={v=>set("collageManuel",v)} label="Collage colle blanche (L+l)"/>
              <Toggle value={tp.encollageOsama&&!osamaOff} onChange={v=>set("encollageOsama",v)} label="Encollage OSAMA"/>
              {osamaOff&&<div style={{fontSize:11,color:G.green,marginLeft:46}}>✅ OSAMA désactivé auto</div>}
            </div>
          </div>

          {/* CNC + Chant */}
          <div>
            <div style={{fontSize:11,color:G.textMuted,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Options finition</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <Toggle value={tp.detourage} onChange={v=>set("detourage",v)} label="Détourage CNC"/>
              {tp.detourage&&(
                <div style={{marginLeft:20,padding:"8px 10px",background:G.surfaceAlt,borderRadius:7}}>
                  <Toggle value={tp.cnc5axes} onChange={v=>set("cnc5axes",v)} label="CNC 5 axes"/>
                  <div style={{marginTop:8,display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    <Toggle value={!!tp.options?.poignee}       onChange={v=>setOpt("poignee",v)}       label="Poignée"/>
                    <Toggle value={!!tp.options?.encoches}      onChange={v=>setOpt("encoches",v)}      label="Encoches"/>
                    <Toggle value={!!tp.options?.chanfrein}     onChange={v=>setOpt("chanfrein",v)}     label="Chanfrein"/>
                    <Toggle value={!!tp.options?.coinsArrondis} onChange={v=>setOpt("coinsArrondis",v)} label="Coins arrondis"/>
                  </div>
                </div>
              )}
              <Toggle value={tp.chant} onChange={setChant} label="Chant (plaqueuse)"
                disabled={chantBloque}
                disabledReason="Incompatible avec chanfrein / coins arrondis"/>
              {tp.chant&&!chantBloque&&params.chants?.length>0&&(
                <div style={{marginLeft:20,marginTop:4}}>
                  <select value={tp.chantRefId||1} onChange={e=>set("chantRefId",+e.target.value)} style={{fontSize:12}}>
                    {params.chants.map(c=><option key={c.id} value={c.id}>{c.nom} — {fmt(c.prix,2)}€/ml</option>)}
                  </select>
                </div>
              )}

              {/* Étiquette */}
              <Toggle value={tp.etiquette} onChange={v=>set("etiquette",v)} label="Étiquette"/>
              {tp.etiquette&&(
                <div style={{marginLeft:20,padding:"8px 10px",background:G.surfaceAlt,borderRadius:7}}>
                  <Toggle value={tp.etiquetteFournie} onChange={v=>set("etiquetteFournie",v)} label="Fournie client (MO seule)"/>
                  <div style={{marginTop:8,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                    <Field label="Faces à étiqueter">
                      <select value={tp.facesEtiquetees} onChange={e=>set("facesEtiquetees",+e.target.value)}>
                        <option value={1}>1 face</option>
                        <option value={2}>2 faces</option>
                      </select>
                    </Field>
                    <Field label="Long. étiq. (mm)">
                      <input type="number" value={tp.etiquetteL||100} min={1} onChange={e=>set("etiquetteL",+e.target.value)}/>
                    </Field>
                    <Field label="Larg. étiq. (mm)">
                      <input type="number" value={tp.etiquettel||70} min={1} onChange={e=>set("etiquettel",+e.target.value)}/>
                    </Field>
                  </div>
                  <div style={{fontSize:11,color:G.textMuted,marginTop:4}}>
                    Surface : <b style={{fontFamily:"DM Mono",color:G.text}}>{fmt((tp.etiquetteL||100)*(tp.etiquettel||70)/100,2)} cm²</b>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Palette */}
          <div>
            <div style={{fontSize:11,color:G.textMuted,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Palette & conditionnement</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <Toggle value={tp.palette} onChange={v=>set("palette",v)} label="Palette"/>
              {tp.palette&&(
                <div style={{marginLeft:20,padding:"8px 10px",background:G.surfaceAlt,borderRadius:7}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <Field label="Type palette">
                      <select value={String(tp.paletteType)} onChange={e=>set("paletteType",e.target.value)}>
                        {params.palettes.map(p=><option key={p.id} value={String(p.id)}>{p.nom}</option>)}
                      </select>
                    </Field>
                    <Field label="Panneaux/palette" hint="Ex: 6 panneaux/kit × 5 kits = 30">
                      <input type="number" value={tp.panneauxParPalette||""} min={1}
                        onChange={e=>set("panneauxParPalette", e.target.value===""?0:+e.target.value)}/>
                    </Field>
                  </div>
                  {/* Raccourcis kitting */}
                  <div style={{marginTop:6,display:"flex",gap:4,flexWrap:"wrap"}}>
                    {[1,2,3,4,5,6,8,10,15,20,30].map(n=>(
                      <button key={n} onClick={()=>set("panneauxParPalette",n)} style={{background:tp.panneauxParPalette===n?G.accent:G.surfaceAlt,color:tp.panneauxParPalette===n?"#000":G.textMuted,border:`1px solid ${G.border}`,borderRadius:4,padding:"2px 6px",fontSize:11,cursor:"pointer"}}>{n}</button>
                    ))}
                  </div>
                  <div style={{fontSize:11,color:G.textMuted,marginTop:6,lineHeight:1.6}}>
                    → <b style={{color:G.text,fontFamily:"DM Mono"}}>{Math.ceil((tp.quantite||1)/(tp.panneauxParPalette||10))}</b> palettes
                    · <b style={{color:G.text,fontFamily:"DM Mono"}}>{tp.panneauxParPalette||10}</b> panneaux/palette
                    {tp.panneauxParPalette>0&&tp.quantite>0&&(tp.quantite%(tp.panneauxParPalette))>0&&
                      <span style={{color:G.orange}}> · dernière palette incomplète ({tp.quantite%(tp.panneauxParPalette||10)} pann.)</span>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Marge */}
          <div>
            <div style={{fontSize:11,color:G.textMuted,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Marge</div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <input type="number" value={tp.margePct||""} min={0} max={99} onChange={e=>set("margePct", e.target.value===""?0:+e.target.value)} style={{width:80}}/>
              <span style={{fontSize:12,color:G.textMuted}}>%</span>
              {[20,25,30,35,40].map(m=><button key={m} onClick={()=>set("margePct",m)} style={{background:tp.margePct===m?G.accent:G.surfaceAlt,color:tp.margePct===m?"#000":G.textMuted,border:`1px solid ${G.border}`,borderRadius:4,padding:"3px 7px",fontSize:11,cursor:"pointer"}}>{m}</button>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tabMain,setTabMain]=useState("devis");
  const [params,setParams]=useState(DEFAULT_PARAMS);
  const [historique,setHistorique]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showResult,setShowResult]=useState(false);
  const [globalResult,setGlobalResult]=useState(null);
  const [editKey,setEditKey]=useState(null); // clé pour forcer re-init DevisForm depuis historique
  const [calepinages,setCalepinages]=useState([]);
  const [cdcTexte,setCdcTexte]=useState("");
  const [currentDevisForm,setCurrentDevisForm]=useState(null);
  const [currentTypes,setCurrentTypes]=useState(null);

  useEffect(()=>{(async()=>{
    const p=await storageGet("params_v6");
    if(p){
      const merged={
        ...DEFAULT_PARAMS,
        ...p,
        tempsCoupeMatiere: p.tempsCoupeMatiere || DEFAULT_PARAMS.tempsCoupeMatiere,
        chants: p.chants || DEFAULT_PARAMS.chants,
        tarifsMO: {...DEFAULT_PARAMS.tarifsMO,...(p.tarifsMO||{})},
        tarifsMachines: {...DEFAULT_PARAMS.tarifsMachines,...(p.tarifsMachines||{})},
        temps: {...DEFAULT_PARAMS.temps,...(p.temps||{})},
        generaux: {...DEFAULT_PARAMS.generaux,...(p.generaux||{})},
        calepinage: {...DEFAULT_PARAMS.calepinage,...(p.calepinage||{})},
      };
      setParams(merged);
    }
    const h=await storageGet("histo_v6");if(h)setHistorique(h);setLoading(false);
  })();},[]);
  const saveParams=useCallback(async np=>{setParams(np);await storageSet("params_v6",np);},[]);
  const saveHisto=useCallback(async nh=>{setHistorique(nh);await storageSet("histo_v6",nh);},[]);

  const lancerCalcul=useCallback((devisForm,typePanneaux)=>{
    const caleps=typePanneaux.map(tp=>{
      const matLameL = tp.lameL||1900, matLamel = tp.lamel||185;
      if (tp.batonRompu) return { recto: null, verso: null };
      const base={hauteurPanneau:tp.dimensionL,largeurPanneau:tp.dimensionl,largeurLame:matLamel,longueurLame:matLameL,margeRangee:params.calepinage.margeRangee,seuilReste:params.calepinage.seuilReste};
      const recto=moteurCalepinage({...base,offsetPct:tp.offsetPctRecto||30});recto.offsetPct=tp.offsetPctRecto||30;
      const verso=tp.rectoVerso?moteurCalepinage({...base,offsetPct:tp.offsetPctVerso||30}):null;if(verso)verso.offsetPct=tp.offsetPctVerso||30;
      return{recto,verso};
    });
    const global=calculerDevisComplet(devisForm,typePanneaux,params,caleps);
    const cdc=genererCDC(devisForm,typePanneaux,params,caleps,global);
    setCalepinages(caleps);setGlobalResult(global);setCdcTexte(cdc);
    setCurrentDevisForm(devisForm);setCurrentTypes(typePanneaux);setShowResult(true);
    const entry={id:uid(),date:new Date().toISOString(),ref:devisForm.reference||"DEV-"+Date.now().toString(36).toUpperCase(),client:devisForm.client,devisForm,typePanneaux,global:{CAKit:global.CAKit,qtyTotal:global.qtyTotal}};
    const nh=[entry,...historique].slice(0,100);saveHisto(nh);
  },[params,historique,saveHisto]);

  if (loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",color:G.textMuted}}>⚙️ Chargement…</div>;

  const TABS=[{id:"devis",icon:"📐",label:"Nouveau devis"},{id:"historique",icon:"📁",label:"Historique"},{id:"params",icon:"⚙️",label:"Paramétrage"}];

  return (
    <div style={{minHeight:"100vh",background:G.bg}}>
      <style>{css}</style>
      <div style={{background:G.surface,borderBottom:`1px solid ${G.border}`,padding:"11px 22px",display:"flex",alignItems:"center",gap:14,position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          {LOGO_FANDI ? <img src={LOGO_FANDI} alt="Fandi" style={{height:38,width:"auto"}}/> : <span style={{fontSize:15,fontWeight:800,color:G.accent}}>■ FANDI</span>}
          <div style={{borderLeft:`1px solid ${G.border}`,paddingLeft:14}}>
            <div style={{fontSize:13,fontWeight:700,color:G.text,letterSpacing:".04em"}}>CHIFFRAGE PANNEAUX</div>
            <div style={{fontSize:9,color:G.textDim,textTransform:"uppercase",letterSpacing:".12em"}}>Multi-panneaux · Kits · CDC Production</div>
          </div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:4}}>
          {TABS.map(t=><button key={t.id} onClick={()=>{setTabMain(t.id);setShowResult(false);}} style={{background:tabMain===t.id?G.accent:"transparent",color:tabMain===t.id?"#000":G.textMuted,border:"none",borderRadius:6,padding:"6px 13px",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>{t.icon} {t.label}</button>)}
        </div>
      </div>
      <div style={{maxWidth:1300,margin:"0 auto",padding:"22px 16px"}}>
        {tabMain==="devis"&&!showResult&&<DevisForm key={editKey||"new"} params={params} onChiffrer={lancerCalcul}
          initialDevisForm={editKey?currentDevisForm:null}
          initialTypes={editKey?currentTypes:null}/>}
        {tabMain==="devis"&&showResult&&<ResultatsView global={globalResult} calepinages={calepinages} cdc={cdcTexte} devisForm={currentDevisForm} typePanneaux={currentTypes} params={params} onBack={()=>setShowResult(false)}/>}
        {tabMain==="historique"&&<HistoriqueView historique={historique}
          onLoad={e=>{
            setCurrentDevisForm(e.devisForm);setCurrentTypes(e.typePanneaux);
            const caleps=(e.typePanneaux||[]).map(tp=>{
              if(tp.batonRompu) return {recto:null,verso:null};
              const base={hauteurPanneau:tp.dimensionL,largeurPanneau:tp.dimensionl,largeurLame:tp.lamel||185,longueurLame:tp.lameL||1900,margeRangee:params.calepinage.margeRangee,seuilReste:params.calepinage.seuilReste};
              const recto=moteurCalepinage({...base,offsetPct:tp.offsetPctRecto||30});recto.offsetPct=tp.offsetPctRecto||30;
              const verso=tp.rectoVerso?moteurCalepinage({...base,offsetPct:tp.offsetPctVerso||30}):null;if(verso)verso.offsetPct=tp.offsetPctVerso||30;
              return{recto,verso};
            });
            setCalepinages(caleps);
            const gl=calculerDevisComplet(e.devisForm,e.typePanneaux,params,caleps);
            setGlobalResult(gl);setCdcTexte(genererCDC(e.devisForm,e.typePanneaux,params,caleps,gl));
            setShowResult(true);setTabMain("devis");
          }}
          onEdit={e=>{
            setCurrentDevisForm(e.devisForm);setCurrentTypes(e.typePanneaux);
            setShowResult(false);setTabMain("devis");
            setEditKey(e.id);
          }}
          onDelete={e=>{
            if(window.confirm(`Supprimer le devis ${e.ref} ?`)){
              const nh=historique.filter(h=>h.id!==e.id);
              saveHisto(nh);
            }
          }}
        />}
        {tabMain==="params"&&<ParamsView params={params} onSave={saveParams}/>}
      </div>
    </div>
  );
}

function DevisForm({params,onChiffrer,initialDevisForm,initialTypes}){
  const [devisForm,setDevisForm]=useState(initialDevisForm||{reference:"",commercial:params.commerciaux[0]?.nom||"",client:"",clientEmail:"",commentaire:"",kitting:false});
  const [types,setTypes]=useState(initialTypes||[defaultTypePanneau(params,0)]);
  const setDF=(k,v)=>setDevisForm(f=>({...f,[k]:v}));

  const updateType=(idx,tp)=>setTypes(ts=>ts.map((t,i)=>i===idx?tp:t));
  const addType=()=>setTypes(ts=>[...ts,defaultTypePanneau(params,ts.length)]);
  const dupType=idx=>setTypes(ts=>{const c=deepCopy(ts[idx]);c.id=uid();c.nom=c.nom+" (copie)";return[...ts.slice(0,idx+1),c,...ts.slice(idx+1)];});
  const delType=idx=>setTypes(ts=>ts.length>1?ts.filter((_,i)=>i!==idx):ts);

  const qtyTotal=types.reduce((s,tp)=>s+(tp.quantite||0),0);
  const anyTropCourte=types.some(tp=>(tp.lamel||185)>tp.dimensionl||(tp.lameL||1900)<=params.calepinage.seuilReste);

  return(
    <div className="fade">
      {/* Infos générales */}
      <Card style={{marginBottom:16}}>
        <STitle>📋 Informations générales</STitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          <Field label="Référence"><input value={devisForm.reference} onChange={e=>setDF("reference",e.target.value)} placeholder="DEV-2024-001"/></Field>
          <Field label="Commercial"><select value={devisForm.commercial} onChange={e=>setDF("commercial",e.target.value)}>{params.commerciaux.map(c=><option key={c.nom} value={c.nom}>{c.nom}</option>)}</select></Field>
          <Field label="Client"><input value={devisForm.client} onChange={e=>setDF("client",e.target.value)} placeholder="Raison sociale"/></Field>
          <Field label="Email client"><input type="email" value={devisForm.clientEmail} onChange={e=>setDF("clientEmail",e.target.value)} placeholder="contact@client.fr"/></Field>
          <Field label="Commentaire" style={{gridColumn:"1/-1"}}><input value={devisForm.commentaire} onChange={e=>setDF("commentaire",e.target.value)}/></Field>

          <Field label="Nb de références" hint="Nb de décors/faces distincts dans ce dossier">
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <input type="number" value={devisForm.nbReferences||""} min={0}
                onChange={e=>setDF("nbReferences",e.target.value===""?0:+e.target.value)}
                style={{width:100}}/>
              {(()=>{
                const sugRecto=types.reduce((s,tp)=>s+tp.quantite,0);
                const sugRV=types.reduce((s,tp)=>s+(tp.rectoVerso?tp.quantite*2:tp.quantite),0);
                return(<div style={{fontSize:11,color:G.textMuted}}>
                  Suggestion : <button onClick={()=>setDF("nbReferences",sugRecto)} style={{background:"transparent",border:"none",color:G.accent2,cursor:"pointer",fontSize:11,textDecoration:"underline"}}>{sugRecto} (recto)</button>
                  {" · "}<button onClick={()=>setDF("nbReferences",sugRV)} style={{background:"transparent",border:"none",color:G.accent2,cursor:"pointer",fontSize:11,textDecoration:"underline"}}>{sugRV} (R/V)</button>
                </div>);
              })()}
            </div>
          </Field>
        </div>
        <div style={{marginTop:8,display:"flex",alignItems:"center",gap:20}}>
          <Toggle value={devisForm.kitting} onChange={v=>setDF("kitting",v)} label={`Kitting — picking ${params.temps.picking_sec}s/pann. · ${qtyTotal} pann. = ${fmtH(params.temps.picking_sec*qtyTotal)} MO logistique`}/>
          {devisForm.kitting&&(()=>{
            const ppk = types[0]?.panneauxParPalette||1;
            const nk = ppk>0 ? Math.ceil(qtyTotal/ppk) : qtyTotal;
            return <div style={{fontSize:11,color:G.purple,marginLeft:46,marginTop:2}}>
              → <b>{nk} kits</b> de <b>{ppk} panneaux</b> · {fmtH(params.temps.picking_sec*ppk)}/kit
              <span style={{color:G.textMuted,marginLeft:6}}>(panneaux/palette du Type 1)</span>
            </div>;
          })()}
          <div style={{fontSize:12,color:G.textMuted}}>
            {types.length} type{types.length>1?"s":""} · <b style={{color:G.text}}>{qtyTotal} panneaux</b> au total
          </div>
        </div>
      </Card>

      {/* Types de panneaux */}
      {types.map((tp,idx)=>(
        <TypePanneauForm key={tp.id} tp={tp} idx={idx} params={params}
          couleur={TYPE_COLORS[idx%TYPE_COLORS.length]}
          onChange={ntp=>updateType(idx,ntp)}
          onDuplicate={()=>dupType(idx)}
          onDelete={()=>delType(idx)}/>
      ))}

      {/* Boutons bas */}
      <div style={{display:"flex",gap:12,alignItems:"center",marginTop:8}}>
        <Btn variant="purple" onClick={addType}>＋ Ajouter un type de panneau</Btn>
        <div style={{flex:1}}/>
        {anyTropCourte&&<div style={{fontSize:12,color:G.red}}>⚠ Lame inutilisable sur au moins un type (trop large ou ≤ seuil de rejet)</div>}
        <Btn onClick={()=>onChiffrer(devisForm,types)} disabled={anyTropCourte} style={{padding:"12px 28px",fontSize:14}}>
          ▶ Chiffrer {devisForm.kitting?"le kit":"le devis"} ({qtyTotal} panneaux)
        </Btn>
      </div>
    </div>
  );
}

function ResultatsView({global:gl,calepinages,cdc,devisForm,typePanneaux,params,onBack}){
  const [tab,setTab]=useState("synthese");
  const [typeActif,setTypeActif]=useState(0);
  const [expanded,setExpanded]=useState({});
  const toggleExpand = (id) => setExpanded(e=>({...e,[id]:!e[id]}));
  const mailInt=buildMailInterne(devisForm,gl,params);
  const mailCli=buildMailClient(devisForm,typePanneaux,gl,params);

  const TABS=[["synthese","📊 Synthèse kit"],["detail","🔍 Détail par type"],["calepinage","🔲 SVG"],["mdf","🪵 MDF"],["conso","📦 Conso matière"],["cdc","📄 CDC"],["devis","🖨 Devis"]];
  const optMDF = optimiserMDF(typePanneaux, params);

  return(
    <div className="fade">
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        <Btn variant="ghost" onClick={onBack} small>← Retour</Btn>
        <div style={{fontSize:18,fontWeight:800}}>{devisForm.client||"—"} — {devisForm.reference||"—"}</div>
        {devisForm.kitting&&<span className="badge-purple">🎁 Kit activé</span>}
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <Btn variant="green" small onClick={()=>imprimerFicheADV(devisForm,typePanneaux,params,calepinages,gl)}>🖨 Fiche ADV</Btn>
          <a href={mailInt} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}><Btn variant="ghost" small>✉️ Gmail int.</Btn></a>
          <a href={mailCli} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}><Btn variant="info" small>📨 Gmail client</Btn></a>
        </div>
      </div>

      {/* KPIs globaux */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:16}}>
        <KpiCard label="CA Kit HT" value={fmtE(gl.CAKit)} sub={`${gl.qtyTotal} panneaux`} color={G.accent}/>
        <KpiCard label="CA Kit TTC" value={fmtE(gl.CAKit*1.2)} sub="TVA 20%"/>
        <KpiCard label="CRU total" value={fmtE(gl.CRUTotal)} sub="Coût revient global"/>
        <KpiCard label="Types" value={typePanneaux.length} sub={`${typePanneaux.map(tp=>tp.quantite).join("+")} pann.`}/>
        {(()=>{const tot=typePanneaux.reduce((s,tp)=>s+(tp.nbReferences||1)*(tp.rectoVerso?2:1),0);return tot>0?<KpiCard label="Designs total" value={tot} sub={typePanneaux.map(tp=>(tp.nbReferences||1)+"réf").join("+")} color={G.orange}/>:null;})()}
        {devisForm.nbReferences>0&&<KpiCard label="Références" value={devisForm.nbReferences} sub="décors distincts" color={G.orange}/>}
        {gl.nbReferences>0&&<KpiCard label="Références/kit" value={gl.nbReferences} sub={`${typePanneaux[0]?.panneauxParPalette||1} pann. × ${gl.nbFacesTotal} face${gl.nbFacesTotal>1?"s":""}`} color={G.orange}/>}
        {(()=>{const o=optimiserMDF(typePanneaux,params);const n=o.reduce((s,i)=>s+i.nbPlaques,0);return n>0?<KpiCard label="Plaques MDF" value={n} sub={fmtE(o.reduce((s,i)=>s+i.coutTotal,0))} color={G.cyan}/>:null;})()}
        {devisForm.kitting&&gl.pickingLigne&&<KpiCard label="Picking" value={fmtH(gl.pickingLigne.tTotal)} sub={`${gl.qtyTotal}×${params.temps.picking_sec}s`} color={G.purple}/>}
      </div>

      <div style={{display:"flex",gap:4,marginBottom:16,flexWrap:"wrap"}}>
        {TABS.map(([id,l])=><button key={id} onClick={()=>setTab(id)} style={{background:tab===id?G.accent:G.surfaceAlt,color:tab===id?"#000":G.textMuted,border:`1px solid ${tab===id?G.accent:G.border}`,borderRadius:6,padding:"6px 13px",fontSize:12,fontWeight:700,cursor:"pointer"}}>{l}</button>)}
      </div>

      {/* SYNTHÈSE */}
      {tab==="synthese"&&(
        <Card>
          <STitle>📊 Synthèse du {devisForm.kitting?"kit":"devis"}</STitle>
          <table>
            <thead><tr><th>Type</th><th>Qté</th><th>Matière</th><th>Calepinage</th><th>CRU unit.</th><th>PV HT unit.</th><th>CA HT</th><th>Marge</th></tr></thead>
            <tbody>
              {typePanneaux.map((tp,i)=>{
                const r=gl.resultatsTypes[i];
                const nomMatiere = tp.matiereType==="parquet"?"Parquet":tp.matiereType==="stratifie"?"Stratifié":tp.matiereType==="vinyle_rigide"?"Vinyle rigide":"Vinyle souple";
                return(<tr key={tp.id}>
                  <td><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:10,height:10,borderRadius:2,background:TYPE_COLORS[i%TYPE_COLORS.length],flexShrink:0}}/><b>{tp.nom}</b></div>
                    <div style={{fontSize:11,color:G.textMuted}}>{tp.dimensionL}×{tp.dimensionl}mm{tp.rectoVerso?" · R/V":""}</div></td>
                  <td className="mono">{tp.quantite}</td>
                  <td style={{fontSize:12}}>{nomMatiere} {tp.lameL}×{tp.lamel}mm</td>
                  <td style={{fontSize:12}}>{tp.calepinageRecto}{tp.rectoVerso?"/"+tp.calepinageVerso:""}</td>
                  <td className="mono">{fmtE(r.CRU)}</td>
                  <td className="mono" style={{color:G.accent}}>{fmtE(r.PV)}</td>
                  <td className="mono" style={{fontWeight:700}}>{fmtE(r.CA)}</td>
                  <td><span className={`badge-${r.statutMarge}`}>{fmt(r.margePct)}%</span></td>
                </tr>);
              })}
              {gl.beLigne&&(
                <tr style={{background:"rgba(6,182,212,.05)"}}>
                  <td><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:10,height:10,borderRadius:2,background:G.cyan,flexShrink:0}}/><b>Prise info / BE</b></div>
                    <div style={{fontSize:11,color:G.textMuted}}>1 dossier · {params.temps.priseInfo_min} min BE</div></td>
                  <td className="mono">—</td>
                  <td style={{fontSize:12}}>Admin/BE</td>
                  <td style={{fontSize:12}}>dossier</td>
                  <td className="mono">{fmtE(gl.cBE)}</td>
                  <td className="mono" style={{color:G.accent}}>{fmtE(gl.pvBE||0)}</td>
                  <td className="mono" style={{fontWeight:700}}>{fmtE(gl.pvBE||0)}</td>
                  <td><span className="badge-blue">dossier</span></td>
                </tr>
              )}
              {devisForm.kitting&&gl.pickingLigne&&(
                <tr style={{background:"rgba(168,85,247,.05)"}}>
                  <td><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:10,height:10,borderRadius:2,background:G.purple,flexShrink:0}}/><b>Picking kit</b></div>
                    <div style={{fontSize:11,color:G.textMuted}}>
                      {gl.qtyTotal} pann. × {params.temps.picking_sec}s · {gl.pickingLigne.nbKits} kits de {gl.pickingLigne.pannParKit} pann.
                    </div>
                    <div style={{fontSize:11,color:G.textMuted}}>
                      {fmtH(gl.pickingLigne.tParKit)}/kit · {fmtH(gl.pickingLigne.tTotal)} total
                    </div>
                  </td>
                  <td className="mono">{gl.qtyTotal}</td>
                  <td colSpan={2} style={{fontSize:12,color:G.textMuted}}>MO logistique</td>
                  <td className="mono">{fmtE(gl.pickingLigne.cMO)}</td>
                  <td className="mono" style={{color:G.accent}}>{fmtE(gl.pickingCA)}</td>
                  <td className="mono" style={{fontWeight:700}}>{fmtE(gl.pickingCA)}</td>
                  <td>—</td>
                </tr>
              )}
            </tbody>
            <tfoot><tr>
              <td colSpan={6} style={{color:G.textMuted,fontSize:12}}>TOTAL KIT</td>
              <td className="mono" style={{fontSize:16,color:G.accent}}>{fmtE(gl.CAKit)}</td>
              <td/>
            </tr></tfoot>
          </table>
          {gl.nbReferences>0&&(
            <div style={{marginTop:14,padding:"10px 14px",background:"rgba(245,158,11,.07)",border:"1px solid rgba(245,158,11,.2)",borderRadius:8,display:"flex",alignItems:"center",gap:16}}>
              <div>
                <span style={{fontSize:11,color:G.textMuted,textTransform:"uppercase",letterSpacing:".06em"}}>Références par kit</span>
                <div style={{fontSize:20,fontWeight:800,fontFamily:"DM Mono",color:G.orange}}>{gl.nbReferences}</div>
              </div>
              <div style={{fontSize:12,color:G.textMuted}}>
                {typePanneaux[0]?.panneauxParPalette||1} panneau{(typePanneaux[0]?.panneauxParPalette||1)>1?"x":""} par kit
                × {gl.nbFacesTotal} face{gl.nbFacesTotal>1?"s":""} = <b style={{color:G.orange}}>{gl.nbReferences} références distinctes</b>
              </div>
              <div style={{fontSize:11,color:G.textMuted,marginLeft:"auto"}}>
                {typePanneaux.map((tp,i)=>(
                  <span key={i} style={{marginRight:8}}>
                    {tp.nom} : {(typePanneaux[0]?.panneauxParPalette||1)}×{tp.rectoVerso?2:1}f
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* DÉTAIL PAR TYPE */}
      {tab==="detail"&&(
        <div>
          <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            {typePanneaux.map((tp,i)=>(
              <button key={tp.id} onClick={()=>setTypeActif(i)}
                style={{background:typeActif===i?TYPE_COLORS[i%TYPE_COLORS.length]:"transparent",color:typeActif===i?"#000":TYPE_COLORS[i%TYPE_COLORS.length],border:`2px solid ${TYPE_COLORS[i%TYPE_COLORS.length]}`,borderRadius:6,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                {tp.nom} ({tp.quantite})
              </button>
            ))}
          </div>
          {gl.resultatsTypes[typeActif]&&(
            <Card>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:14,height:14,borderRadius:3,background:TYPE_COLORS[typeActif%TYPE_COLORS.length]}}/>
                <div style={{fontSize:16,fontWeight:800}}>{typePanneaux[typeActif].nom}</div>
                <span className={`badge-${gl.resultatsTypes[typeActif].statutMarge}`}>Marge {fmt(gl.resultatsTypes[typeActif].margePct)}%</span>
                <div style={{marginLeft:"auto",display:"flex",gap:16}}>
                  <div><div style={{fontSize:11,color:G.textMuted}}>CRU unit.</div><div className="mono" style={{fontWeight:700}}>{fmtE(gl.resultatsTypes[typeActif].CRU)}</div></div>
                  <div><div style={{fontSize:11,color:G.textMuted}}>PV HT</div><div className="mono" style={{fontWeight:700,color:G.accent}}>{fmtE(gl.resultatsTypes[typeActif].PV)}</div></div>
                  <div><div style={{fontSize:11,color:G.textMuted}}>CA HT</div><div className="mono" style={{fontWeight:700}}>{fmtE(gl.resultatsTypes[typeActif].CA)}</div></div>
                </div>
              </div>
              <table>
                <thead><tr><th>Étape</th><th>Détail</th><th>tMO</th><th>tMach</th><th>€MO</th><th>€Mach</th><th>€Achat</th><th>Total</th></tr></thead>
                <tbody>
                  {gl.resultatsTypes[typeActif].lignes.map((l,i)=>(
                    <tr key={i}>
                      <td style={{fontWeight:600}}>{l.etape}</td>
                      <td style={{fontSize:11,color:G.textMuted}}>{l.detail}</td>
                      <td className="mono">{fmtH(l.tMO_unit)}</td>
                      <td className="mono">{fmtH(l.tMach_unit)}</td>
                      <td className="mono">{fmtE(l.cMO)}</td>
                      <td className="mono">{fmtE(l.cMach)}</td>
                      <td className="mono">{fmtE(l.cAchat)}</td>
                      <td className="mono" style={{fontWeight:700,color:G.accent}}>{fmtE(l.cMO+l.cMach+l.cAchat)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr>
                  <td colSpan={4} style={{color:G.textMuted,fontSize:12}}>TOTAL UNITAIRE</td>
                  <td className="mono">{fmtE(gl.resultatsTypes[typeActif].totMO)}</td>
                  <td className="mono">{fmtE(gl.resultatsTypes[typeActif].totMach)}</td>
                  <td className="mono">{fmtE(gl.resultatsTypes[typeActif].totAchat)}</td>
                  <td className="mono" style={{color:G.accent}}>{fmtE(gl.resultatsTypes[typeActif].CRU)}</td>
                </tr></tfoot>
              </table>
            </Card>
          )}
        </div>
      )}

      {/* SVG */}
      {tab==="calepinage"&&(
        <div>
          <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
            {typePanneaux.map((tp,i)=>(
              <button key={tp.id} onClick={()=>setTypeActif(i)}
                style={{background:typeActif===i?TYPE_COLORS[i%TYPE_COLORS.length]:"transparent",color:typeActif===i?"#000":TYPE_COLORS[i%TYPE_COLORS.length],border:`2px solid ${TYPE_COLORS[i%TYPE_COLORS.length]}`,borderRadius:6,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                {tp.nom}
              </button>
            ))}
          </div>
          <Card>
            <STitle>{typePanneaux[typeActif]?.nom} — Pattern{typePanneaux[typeActif]?.rectoVerso?" Recto / Verso":""}</STitle>
            {typePanneaux[typeActif]?.batonRompu ? (
              <SvgBatonRompu tp={typePanneaux[typeActif]} params={params}/>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:typePanneaux[typeActif]?.rectoVerso?"1fr 1fr":"1fr",gap:16}}>
                {calepinages[typeActif]?.recto&&<SvgCalepinage calep={calepinages[typeActif].recto} label={typePanneaux[typeActif]?.rectoVerso?"RECTO":undefined}/>}
                {calepinages[typeActif]?.verso&&typePanneaux[typeActif]?.rectoVerso&&<SvgCalepinage calep={calepinages[typeActif].verso} label="VERSO"/>}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* CDC */}
      {tab==="mdf"&&(
        <div>
          <Card style={{marginBottom:12}}>
            <STitle>🪵 Optimisation MDF — Commande dossier</STitle>
            <table>
              <thead><tr><th>Type</th><th>Support</th><th>Plaque MDF</th><th>Pièces/plaque</th><th>Utilisation</th><th>Plaques</th><th>Coût MDF</th></tr></thead>
              <tbody>
                {optMDF.map((item,i)=>(
                  <tr key={i}>
                    <td><b>{item.tp.nom}</b><div style={{fontSize:11,color:G.textMuted}}>{item.tp.dimensionL}×{item.tp.dimensionl}mm × {item.qty}</div></td>
                    <td>{item.type==="plein"?"Plein":"Lattes"}</td>
                    <td style={{fontSize:12}}>{item.mdfRef.nom}</td>
                    <td className="mono">{item.best.piecesParPlaque}</td>
                    <td><span className={item.best.piecesParPlaque>0?`badge-${Math.round(item.best.piecesParPlaque*item.best.pieceL*item.best.piecel/(item.mdfRef.L*item.mdfRef.l)*100)>=70?"green":Math.round(item.best.piecesParPlaque*item.best.pieceL*item.best.piecel/(item.mdfRef.L*item.mdfRef.l)*100)>=40?"orange":"red"}`:"badge-red"}>
                      {Math.round(item.best.piecesParPlaque*item.best.pieceL*item.best.piecel/(item.mdfRef.L*item.mdfRef.l)*100)}%
                    </span></td>
                    <td className="mono" style={{fontWeight:700,color:G.accent}}>{item.nbPlaques}</td>
                    <td className="mono">{fmtE(item.coutTotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr>
                <td colSpan={5} style={{color:G.textMuted}}>TOTAL MDF à commander</td>
                <td className="mono" style={{fontWeight:700}}>{optMDF.reduce((s,i)=>s+i.nbPlaques,0)} plaques</td>
                <td className="mono" style={{fontWeight:700}}>{fmtE(optMDF.reduce((s,i)=>s+i.coutTotal,0))}</td>
              </tr></tfoot>
            </table>
          </Card>
          <SvgMDF optMDF={optMDF}/>
        </div>
      )}

      {tab==="conso"&&(
        <div>
          {/* Récap par type */}
          {typePanneaux.map((tp,i)=>{
            const r=gl.resultatsTypes[i];
            const nom=r.nomenclature;
            const col=TYPE_COLORS[i%TYPE_COLORS.length];
            return(
              <Card key={tp.id} style={{marginBottom:16,borderLeft:`3px solid ${col}`}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                  <STitle style={{color:col,margin:0,border:"none",padding:0}}>{tp.nom} — {tp.quantite} panneaux</STitle>
                  <div style={{fontSize:12,color:G.orange,fontWeight:700}}>
                    {tp.nbReferences||1} réf. × {tp.rectoVerso?2:1} face{tp.rectoVerso?"s":""} = <b style={{fontFamily:"DM Mono"}}>{(tp.nbReferences||1)*(tp.rectoVerso?2:1)}</b> designs
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>

                  {/* MDF */}
                  {nom.mdf&&(
                    <div style={{padding:"10px 14px",background:G.surfaceAlt,borderRadius:8}}>
                      <div style={{fontSize:10,color:G.textMuted,textTransform:"uppercase",marginBottom:6}}>🪵 MDF</div>
                      {nom.mdf.type==="plein"?(
                        <>
                          <div style={{fontSize:15,fontWeight:700,fontFamily:"DM Mono"}}>{nom.mdf.nb} plaques</div>
                          <div style={{fontSize:12,color:G.textMuted}}>{nom.mdf.ref}</div>
                          <div style={{fontSize:12,color:G.textMuted}}>{nom.mdf.nbrParPlaque} panneaux/plaque</div>
                          <div style={{fontSize:12,color:G.red,marginTop:4}}>{fmtE(nom.mdf.cout)}</div>
                        </>
                      ):(
                        <>
                          <div style={{fontSize:15,fontWeight:700,fontFamily:"DM Mono"}}>{nom.mdf.nbLattes} lattes/panneau</div>
                          <div style={{fontSize:12,color:G.textMuted}}>{nom.mdf.latteL}×{nom.mdf.lattel}mm · {nom.mdf.ref}</div>
                          <div style={{fontSize:12,color:G.textMuted}}>{fmt(nom.mdf.mlParPanneau,2)} ml/panneau</div>
                          <div style={{fontSize:12,color:G.red,marginTop:4}}>{fmtE(nom.mdf.cout)}</div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Matière */}
                  {nom.matiere&&(
                    <div style={{padding:"10px 14px",background:G.surfaceAlt,borderRadius:8}}>
                      <div style={{fontSize:10,color:G.textMuted,textTransform:"uppercase",marginBottom:6}}>🪵 Matière</div>
                      <div style={{fontSize:15,fontWeight:700,fontFamily:"DM Mono"}}>{nom.matiere.ref}</div>
                      <div style={{fontSize:12,color:G.textMuted}}>Recto : {fmt(nom.matiere.surfaceRectoUnit*tp.quantite/10000,2)} dm² · perte ~{fmt(nom.matiere.pertePctRecto*100,0)}%</div>
                      {tp.rectoVerso&&<div style={{fontSize:12,color:G.textMuted}}>Verso : {fmt(nom.matiere.surfaceVersoUnit*tp.quantite/10000,2)} dm² · perte ~{fmt(nom.matiere.pertePctVerso*100,0)}%</div>}
                      <div style={{fontSize:12,color:G.accent,marginTop:4,fontWeight:700}}>Total : {fmt(nom.matiere.surfaceTotale,4)} m²</div>
                    </div>
                  )}

                  {/* Colle OSAMA */}
                  {nom.colleOsama>0&&(
                    <div style={{padding:"10px 14px",background:G.surfaceAlt,borderRadius:8}}>
                      <div style={{fontSize:10,color:G.textMuted,textTransform:"uppercase",marginBottom:6}}>🧴 Colle OSAMA</div>
                      <div style={{fontSize:15,fontWeight:700,fontFamily:"DM Mono"}}>{fmt(nom.colleOsama*1000,0)} g</div>
                      <div style={{fontSize:12,color:G.textMuted}}>{fmt(nom.colleOsama,3)} kg</div>
                      <div style={{fontSize:12,color:G.red,marginTop:4}}>{fmtE(nom.colleOsama*params.colleOsama.prix)}</div>
                    </div>
                  )}

                  {/* Colle blanche */}
                  {nom.colleBlanc>0&&(
                    <div style={{padding:"10px 14px",background:G.surfaceAlt,borderRadius:8}}>
                      <div style={{fontSize:10,color:G.textMuted,textTransform:"uppercase",marginBottom:6}}>🧴 Colle blanche</div>
                      <div style={{fontSize:15,fontWeight:700,fontFamily:"DM Mono"}}>{fmt(nom.colleBlanc*1000,0)} g</div>
                      <div style={{fontSize:12,color:G.textMuted}}>{fmt(nom.colleBlanc,3)} kg</div>
                      <div style={{fontSize:12,color:G.red,marginTop:4}}>{fmtE(nom.colleBlanc*params.colleBlanc.prix)}</div>
                    </div>
                  )}

                  {/* Chant */}
                  {nom.chant>0&&(
                    <div style={{padding:"10px 14px",background:G.surfaceAlt,borderRadius:8}}>
                      <div style={{fontSize:10,color:G.textMuted,textTransform:"uppercase",marginBottom:6}}>🔲 Chant ABS</div>
                      <div style={{fontSize:15,fontWeight:700,fontFamily:"DM Mono"}}>{fmt(nom.chant,2)} ml</div>
                      <div style={{fontSize:12,color:G.textMuted}}>{fmt(nom.chant/tp.quantite,2)} ml/panneau</div>
                      <div style={{fontSize:12,color:G.red,marginTop:4}}>{fmtE(nom.chant*(params.chants.find(c=>c.id===tp.chantRefId)||params.chants[0])?.prix*(1+((params.chants.find(c=>c.id===tp.chantRefId)||params.chants[0])?.marge||20)/100))}</div>
                    </div>
                  )}

                  {/* Étiquettes */}
                  {nom.etiquettes>0&&(
                    <div style={{padding:"10px 14px",background:G.surfaceAlt,borderRadius:8}}>
                      <div style={{fontSize:10,color:G.textMuted,textTransform:"uppercase",marginBottom:6}}>🏷 Étiquettes</div>
                      <div style={{fontSize:15,fontWeight:700,fontFamily:"DM Mono"}}>{nom.etiquettes*tp.quantite} unités</div>
                      <div style={{fontSize:12,color:G.textMuted}}>{nom.etiquettes} face{nom.etiquettes>1?"s":""}/panneau</div>
                      {tp.etiquetteL&&tp.etiquettel&&<div style={{fontSize:12,color:G.accent,marginTop:4}}>{tp.etiquetteL}×{tp.etiquettel}mm · {fmt(tp.etiquetteL*tp.etiquettel/100,1)} cm²</div>}
                      {tp.etiquetteFournie&&<div style={{fontSize:11,color:G.green,marginTop:2}}>Fournie client</div>}
                    </div>
                  )}

                  {/* Lames matière */}
                  {nom.lames&&(()=>{
                    const nref = tp.nbReferences||1;
                    const lamesTotalRef = Math.ceil(nom.lames.total / nref);
                    return(
                      <div style={{padding:"10px 14px",background:G.surfaceAlt,borderRadius:8,border:`1px solid ${col}33`}}>
                        <div style={{fontSize:10,color:G.textMuted,textTransform:"uppercase",marginBottom:6}}>🪵 Lames à commander</div>
                        <div style={{fontSize:15,fontWeight:700,fontFamily:"DM Mono",color:col}}>{nom.lames.total} lames</div>
                        <div style={{fontSize:12,color:G.textMuted,marginTop:2}}>{nom.lames.lameL}×{nom.lames.lamel}mm{nom.lames.modeBaton?" · bâton rompu":""}</div>
                        <div style={{marginTop:8,display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                          <div style={{padding:"6px 8px",background:G.surface,borderRadius:5}}>
                            <div style={{fontSize:9,color:G.textMuted,textTransform:"uppercase",marginBottom:2}}>Par panneau</div>
                            <div style={{fontSize:14,fontWeight:700,fontFamily:"DM Mono",color:col}}>{nom.lames.nbParPanneau}</div>
                            <div style={{fontSize:10,color:G.textMuted}}>× {tp.quantite} panneaux</div>
                          </div>
                          <div style={{padding:"6px 8px",background:G.surface,borderRadius:5}}>
                            <div style={{fontSize:9,color:G.textMuted,textTransform:"uppercase",marginBottom:2}}>Par référence</div>
                            <div style={{fontSize:14,fontWeight:700,fontFamily:"DM Mono",color:G.accent}}>{lamesTotalRef}</div>
                            <div style={{fontSize:10,color:G.textMuted}}>÷ {nref} réf.</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Palettes */}
                  {nom.palettes>0&&(
                    <div style={{padding:"10px 14px",background:G.surfaceAlt,borderRadius:8}}>
                      <div style={{fontSize:10,color:G.textMuted,textTransform:"uppercase",marginBottom:6}}>📦 Palettes</div>
                      <div style={{fontSize:15,fontWeight:700,fontFamily:"DM Mono"}}>{nom.palettes} palettes</div>
                      <div style={{fontSize:12,color:G.textMuted}}>{tp.panneauxParPalette} panneaux/palette</div>
                      <div style={{fontSize:12,color:G.textMuted}}>{(params.palettes.find(p=>String(p.id)===String(tp.paletteType))||params.palettes[0])?.nom}</div>
                    </div>
                  )}

                  {/* Emballages */}
                  {nom.emballages?.length>0&&nom.emballages.map((e,j)=>(
                    <div key={j} style={{padding:"10px 14px",background:G.surfaceAlt,borderRadius:8}}>
                      <div style={{fontSize:10,color:G.textMuted,textTransform:"uppercase",marginBottom:6}}>📦 {e.nom}</div>
                      <div style={{fontSize:15,fontWeight:700,fontFamily:"DM Mono"}}>{e.qte*tp.quantite} unités</div>
                      <div style={{fontSize:12,color:G.textMuted}}>{e.qte}/panneau</div>
                      <div style={{fontSize:12,color:G.red,marginTop:4}}>{fmtE(e.cout*tp.quantite)}</div>
                    </div>
                  ))}

                </div>
              </Card>
            );
          })}

          {/* Récap global dossier */}
          <Card>
            <STitle>📦 Récap global dossier</STitle>
            <table>
              <thead><tr><th>Article</th><th>Quantité</th><th>Coût total</th></tr></thead>
              <tbody>
                {(()=>{
                  const rows=[];
                  {// Références par type
                  typePanneaux.forEach((tp2,i2)=>{
                    const nref=tp2.nbReferences||1;
                    const designs=nref*(tp2.rectoVerso?2:1);
                    rows.push(["🎨 "+tp2.nom,nref+" référence"+(nref>1?"s":""),designs+" design"+(designs>1?"s":"")]);
                  });}
                  // MDF plaques
                  const totalPlaques=gl.resultatsTypes.reduce((s,r)=>s+(r.nomenclature.mdf?.nb||0),0);
                  if(totalPlaques>0) rows.push(["🪵 Plaques MDF",totalPlaques+" plaques",fmtE(gl.resultatsTypes.reduce((s,r)=>s+(r.nomenclature.mdf?.cout||0),0))]);
                  // Colle OSAMA
                  const totalOsama=gl.resultatsTypes.reduce((s,r)=>s+r.nomenclature.colleOsama,0);
                  if(totalOsama>0) rows.push(["🧴 Colle OSAMA",fmt(totalOsama*1000,0)+" g · "+fmt(totalOsama,3)+" kg",fmtE(totalOsama*params.colleOsama.prix)]);
                  // Colle blanche
                  const totalBlanc=gl.resultatsTypes.reduce((s,r)=>s+r.nomenclature.colleBlanc,0);
                  if(totalBlanc>0) rows.push(["🧴 Colle blanche",fmt(totalBlanc*1000,0)+" g · "+fmt(totalBlanc,3)+" kg",fmtE(totalBlanc*params.colleBlanc.prix)]);
                  // Chant
                  const totalChant=gl.resultatsTypes.reduce((s,r)=>s+r.nomenclature.chant,0);
                  if(totalChant>0) rows.push(["🔲 Chant ABS",fmt(totalChant,2)+" ml",""]);
                  // Palettes
                  const totalPal=gl.resultatsTypes.reduce((s,r)=>s+r.nomenclature.palettes,0);
                  if(totalPal>0) rows.push(["📦 Palettes",totalPal+" palettes",""]);
                  if(gl.nbReferences>0) rows.push(["🔖 Références/kit",gl.nbReferences+" références",typePanneaux[0]?.panneauxParPalette+" pann./kit × "+gl.nbFacesTotal+" face(s)"]);
                  // Étiquettes
                  const totalEtiq=gl.resultatsTypes.reduce((s,r,i)=>s+r.nomenclature.etiquettes*typePanneaux[i].quantite,0);
                  if(totalEtiq>0) rows.push(["🏷 Étiquettes",totalEtiq+" unités",""]);
                  // Lames par type
                  gl.resultatsTypes.forEach((r,i)=>{
                    if(r.nomenclature.lames){
                      const tp2=typePanneaux[i];
                      const nref2=tp2.nbReferences||1;
                      const parRef=Math.ceil(r.nomenclature.lames.total/nref2);
                      rows.push([
                        "🪵 Lames "+tp2.nom,
                        r.nomenclature.lames.total+" lames — "+r.nomenclature.lames.lameL+"×"+r.nomenclature.lames.lamel+"mm",
                        r.nomenclature.lames.nbParPanneau+"/panneau · "+parRef+"/réf. (÷"+nref2+")"
                      ]);
                    }
                  });
                  return rows.map(([art,qte,cout],j)=>(
                    <tr key={j}>
                      <td style={{fontWeight:600}}>{art}</td>
                      <td className="mono">{qte}</td>
                      <td className="mono" style={{color:G.red}}>{cout}</td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {tab==="cdc"&&(
        <Card>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <STitle style={{margin:0,border:"none",padding:0}}>📄 CDC Production</STitle>
            <div style={{display:"flex",gap:8}}>
              <Btn small variant="blue" onClick={()=>navigator.clipboard?.writeText(cdc)}>📋 Copier</Btn>
              <Btn small variant="green" onClick={()=>{const b=new Blob([cdc],{type:"text/plain"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=`CDC_${devisForm.reference||"devis"}.txt`;a.click();URL.revokeObjectURL(u);}}>⬇ .txt</Btn>
            </div>
          </div>
          <div style={{background:G.bg,borderRadius:8,padding:"16px 18px",border:`1px solid ${G.border}`,maxHeight:640,overflowY:"auto"}}>
            <pre style={{color:G.text}}>{cdc}</pre>
          </div>
        </Card>
      )}

      {/* DEVIS CLIENT */}
      {tab==="devis"&&(()=>{
        const fraisParPanneau = ((gl.pvBE||0)+(gl.pickingCA||0)) / gl.qtyTotal;
        return(
        <div>
          {/* Aperçu */}
          <Card style={{marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <STitle style={{margin:0,border:"none",padding:0}}>🖨 Devis client</STitle>
              <div style={{display:"flex",gap:8}}>
                <Btn variant="green" onClick={()=>ouvrirPDFDevis(devisForm,typePanneaux,params,gl)}>📄 Ouvrir PDF</Btn>
                <a href={mailCli} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}><Btn variant="info">📨 Gmail client</Btn></a>
                <a href={mailInt} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}><Btn variant="ghost">✉️ Interne</Btn></a>
              </div>
            </div>
            {/* Résumé prix */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:16}}>
              <div style={{padding:"10px 14px",background:G.surfaceAlt,borderRadius:8}}>
                <div style={{fontSize:9,color:G.textMuted,textTransform:"uppercase",marginBottom:3}}>Total HT</div>
                <div style={{fontSize:20,fontWeight:800,fontFamily:"DM Mono",color:G.accent}}>{fmtE(gl.CAKit)}</div>
              </div>
              <div style={{padding:"10px 14px",background:G.surfaceAlt,borderRadius:8}}>
                <div style={{fontSize:9,color:G.textMuted,textTransform:"uppercase",marginBottom:3}}>TVA 20%</div>
                <div style={{fontSize:20,fontWeight:800,fontFamily:"DM Mono"}}>{fmtE(gl.CAKit*0.2)}</div>
              </div>
              <div style={{padding:"10px 14px",background:"rgba(232,160,32,.1)",borderRadius:8,border:`1px solid ${G.accent}44`}}>
                <div style={{fontSize:9,color:G.textMuted,textTransform:"uppercase",marginBottom:3}}>Total TTC</div>
                <div style={{fontSize:20,fontWeight:800,fontFamily:"DM Mono",color:G.accent}}>{fmtE(gl.CAKit*1.2)}</div>
              </div>
              <div style={{padding:"10px 14px",background:G.surfaceAlt,borderRadius:8}}>
                <div style={{fontSize:9,color:G.textMuted,textTransform:"uppercase",marginBottom:3}}>Prix/panneau</div>
                <div style={{fontSize:20,fontWeight:800,fontFamily:"DM Mono"}}>{fmtE(gl.CAKit/gl.qtyTotal)}</div>
                <div style={{fontSize:10,color:G.textMuted}}>frais inclus</div>
              </div>
            </div>
            {/* Tableau prix par type */}
            <table>
              <thead><tr><th>Type</th><th>Qté</th><th>PU HT (frais inclus)</th><th>Total HT</th></tr></thead>
              <tbody>
                {devisForm.kitting?(
                  <tr>
                    <td>
                      <b>Kit panneaux</b>
                      <div style={{fontSize:11,color:G.textMuted}}>{typePanneaux.map(tp=>`${tp.quantite}× ${tp.nom}`).join(" · ")}</div>
                      <div style={{fontSize:10,color:G.textMuted}}>Matière fournie · Pose + kitting inclus</div>
                    </td>
                    <td className="mono">{gl.qtyTotal}</td>
                    <td className="mono" style={{color:G.accent}}>{fmtE(gl.CAKit/gl.qtyTotal)}</td>
                    <td className="mono" style={{fontWeight:700,fontSize:15}}>{fmtE(gl.CAKit)}</td>
                  </tr>
                ):(
                  typePanneaux.map((tp,i)=>{
                    const r=gl.resultatsTypes[i];
                    const pv=r.PV+fraisParPanneau;
                    const ca=pv*tp.quantite;
                    const col=TYPE_COLORS[i%TYPE_COLORS.length];
                    const isOpen=!!expanded[tp.id];
                    return(<React.Fragment key={tp.id}>
                      <tr style={{cursor:"pointer"}} onClick={()=>toggleExpand(tp.id)}>
                        <td>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{width:8,height:8,borderRadius:2,background:col,flexShrink:0}}/>
                            <b>{tp.nom}</b>
                            <span style={{fontSize:10,color:G.textMuted,marginLeft:4}}>{isOpen?"▲":"▼"} détail</span>
                          </div>
                          <div style={{fontSize:11,color:G.textMuted}}>{tp.dimensionL}×{tp.dimensionl}mm · {tp.calepinageRecto}{tp.rectoVerso?" R/V":""}</div>
                          {tp.nbReferences>1&&<div style={{fontSize:10,color:col}}>{tp.nbReferences} références</div>}
                        </td>
                        <td className="mono">{tp.quantite}</td>
                        <td className="mono" style={{color:G.accent}}>{fmtE(pv)}</td>
                        <td className="mono" style={{fontWeight:700}}>{fmtE(ca)}</td>
                      </tr>
                      {isOpen&&<tr>
                        <td colSpan={4} style={{padding:0,background:G.bg}}>
                          <div style={{padding:"10px 16px"}}>
                            <div style={{fontSize:10,color:G.accent,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Détail coût unitaire / panneau</div>
                            <table style={{marginBottom:8}}>
                              <thead><tr>
                                <th style={{fontSize:9}}>Étape</th>
                                <th style={{fontSize:9}}>t MO</th>
                                <th style={{fontSize:9}}>€ MO</th>
                                <th style={{fontSize:9}}>€ Mach.</th>
                                <th style={{fontSize:9}}>€ Achat</th>
                                <th style={{fontSize:9}}>Total</th>
                              </tr></thead>
                              <tbody>
                                {r.lignes.map((lg,j)=>{
                                  const tot=lg.cMO+lg.cMach+lg.cAchat;
                                  return(<tr key={j} style={{background:"transparent"}}>
                                    <td style={{fontSize:11,fontWeight:500}}>{lg.etape}
                                      {lg.detail&&<div style={{fontSize:10,color:G.textMuted}}>{lg.detail}</div>}
                                    </td>
                                    <td className="mono" style={{fontSize:11}}>{fmtH(lg.tMO_unit)}</td>
                                    <td className="mono" style={{fontSize:11}}>{fmtE(lg.cMO)}</td>
                                    <td className="mono" style={{fontSize:11}}>{fmtE(lg.cMach)}</td>
                                    <td className="mono" style={{fontSize:11}}>{fmtE(lg.cAchat)}</td>
                                    <td className="mono" style={{fontSize:11,color:G.accent}}>{fmtE(tot)}</td>
                                  </tr>);
                                })}
                              </tbody>
                              <tfoot><tr>
                                <td style={{fontSize:10,color:G.textMuted}}>CRU unitaire</td>
                                <td/><td className="mono">{fmtE(r.totMO)}</td>
                                <td className="mono">{fmtE(r.totMach)}</td>
                                <td className="mono">{fmtE(r.totAchat)}</td>
                                <td className="mono" style={{color:G.accent,fontWeight:700}}>{fmtE(r.CRU)}</td>
                              </tr>
                              <tr>
                                <td colSpan={4} style={{fontSize:10,color:G.textMuted}}>+ Frais BE/admin/picking ramenés au panneau</td>
                                <td/><td className="mono" style={{color:G.purple}}>{fmtE(fraisParPanneau)}</td>
                              </tr>
                              <tr>
                                <td colSpan={4} style={{fontSize:10,color:G.textMuted,fontWeight:700}}>PV unitaire (frais inclus)</td>
                                <td/><td className="mono" style={{color:G.accent,fontWeight:800,fontSize:13}}>{fmtE(pv)}</td>
                              </tr></tfoot>
                            </table>
                          </div>
                        </td>
                      </tr>}
                    </React.Fragment>);
                  })
                )}
              </tbody>
              <tfoot><tr>
                <td colSpan={3} style={{color:G.textMuted,fontSize:11}}>TOTAL HT (frais admin et BE inclus dans les prix)</td>
                <td className="mono" style={{fontSize:16,color:G.accent,fontWeight:800}}>{fmtE(gl.CAKit)}</td>
              </tr></tfoot>
            </table>
            <div style={{marginTop:8,fontSize:11,color:G.textDim,textAlign:"center"}}>
              Devis valable 30 jours · Prix HT · Paiement 30j fin de mois · Matière fournie par vos soins
            </div>
          </Card>
        </div>
        );
      })()}
    </div>
  );
}

function HistoriqueView({historique,onLoad,onEdit,onDelete}){
  const [filtre,setFiltre]=useState("");
  if(!historique.length)return<div style={{textAlign:"center",padding:60,color:G.textMuted}}><div style={{fontSize:40,marginBottom:12}}>📁</div><div>Aucun devis enregistré</div></div>;
  const filtered=filtre?historique.filter(h=>(h.ref||"").toLowerCase().includes(filtre.toLowerCase())||(h.client||"").toLowerCase().includes(filtre.toLowerCase())):historique;
  return(
    <div>
      <Card style={{marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <STitle style={{margin:0,border:"none",padding:0}}>📁 Historique des devis</STitle>
          <div style={{marginLeft:"auto",fontSize:12,color:G.textMuted}}>{historique.length} devis enregistrés</div>
        </div>
        <input placeholder="🔍 Rechercher par référence ou client…" value={filtre} onChange={e=>setFiltre(e.target.value)}
          style={{marginBottom:14,maxWidth:360}}/>
        <table>
          <thead><tr><th>Référence</th><th>Date</th><th>Client</th><th>Commercial</th><th>Types</th><th>Qté</th><th>Kit</th><th>CA HT</th><th style={{minWidth:180}}>Actions</th></tr></thead>
          <tbody>{filtered.map(h=>(
            <tr key={h.id}>
              <td style={{fontWeight:700}}>{h.ref}</td>
              <td className="mono" style={{fontSize:11}}>{new Date(h.date).toLocaleDateString("fr-FR")}</td>
              <td>{h.client}</td>
              <td style={{fontSize:12,color:G.textMuted}}>{h.devisForm?.commercial}</td>
              <td className="mono">{h.typePanneaux?.length||1}</td>
              <td className="mono">{h.global?.qtyTotal}</td>
              <td>{h.devisForm?.kitting?<span className="badge-purple">Kit</span>:<span className="badge-blue">Palette</span>}</td>
              <td className="mono" style={{color:G.accent,fontWeight:700}}>{h.global?.CAKit?fmtE(h.global.CAKit):"—"}</td>
              <td>
                <div style={{display:"flex",gap:5}}>
                  <Btn small variant="blue" onClick={()=>onLoad(h)}>👁 Voir</Btn>
                  <Btn small variant="green" onClick={()=>onEdit(h)}>✏️ Modifier</Btn>
                  <Btn small variant="danger" onClick={()=>onDelete(h)}>🗑</Btn>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
        {filtered.length===0&&<div style={{textAlign:"center",padding:24,color:G.textMuted,fontSize:13}}>Aucun résultat pour "{filtre}"</div>}
      </Card>
    </div>
  );
}

function ParamsView({params,onSave}){
  const [local,setLocal]=useState(deepCopy(params));
  const [section,setSection]=useState("tarifs");
  const SECTIONS=[{id:"tarifs",label:"💵 Tarifs"},{id:"mdf",label:"🪵 MDF"},{id:"calepinage",label:"📐 Calepinage"},{id:"colles",label:"🧴 Colles"},{id:"chants",label:"🔲 Chants"},{id:"emballages",label:"📦 Emballages"},{id:"temps",label:"⏱ Temps"},{id:"generaux",label:"⚙️ Généraux"},{id:"commerciaux",label:"👤 Commerciaux"},{id:"emails",label:"✉️ Emails"}];
  return(<div style={{display:"grid",gridTemplateColumns:"180px 1fr",gap:16}}>
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      {SECTIONS.map(s=><button key={s.id} onClick={()=>setSection(s.id)} style={{background:section===s.id?G.accent:"transparent",color:section===s.id?"#000":G.textMuted,border:"none",borderRadius:6,padding:"7px 12px",fontSize:12,fontWeight:600,cursor:"pointer",textAlign:"left"}}>{s.label}</button>)}
      <Btn onClick={()=>onSave(local)} full style={{marginTop:12}}>💾 Sauvegarder</Btn>
    </div>
    <Card>
      {section==="tarifs"&&(<><STitle>MO (€/h)</STitle><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>{Object.entries(local.tarifsMO).map(([k,v])=><Field key={k} label={k}><input type="number" value={v} onChange={e=>setLocal(l=>({...l,tarifsMO:{...l.tarifsMO,[k]:+e.target.value}}))}/></Field>)}</div><STitle>Machines (€/h)</STitle><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{Object.entries(local.tarifsMachines).map(([k,v])=><Field key={k} label={k}><input type="number" value={v} onChange={e=>setLocal(l=>({...l,tarifsMachines:{...l.tarifsMachines,[k]:+e.target.value}}))}/></Field>)}</div></>)}
      {section==="mdf"&&(<><STitle>MDF Plaques</STitle>
  <table><thead><tr><th>Nom</th><th>Ép. mm</th><th>L mm</th><th>l mm</th><th>Prix €</th><th>Marge%</th><th/></tr></thead>
  <tbody>{local.mdfPlaques.map((p,i)=>(
    <tr key={p.id}>
      <td><input type="text" value={p.nom} style={{width:180}} onChange={e=>setLocal(l=>({...l,mdfPlaques:l.mdfPlaques.map((x,j)=>j===i?{...x,nom:e.target.value}:x)}))}/></td>
      <td><input type="number" value={p.epaisseur} style={{width:55}} onChange={e=>setLocal(l=>({...l,mdfPlaques:l.mdfPlaques.map((x,j)=>j===i?{...x,epaisseur:+e.target.value}:x)}))}/></td>
      <td><input type="number" value={p.L} style={{width:75}} onChange={e=>setLocal(l=>({...l,mdfPlaques:l.mdfPlaques.map((x,j)=>j===i?{...x,L:+e.target.value}:x)}))}/></td>
      <td><input type="number" value={p.l} style={{width:75}} onChange={e=>setLocal(l=>({...l,mdfPlaques:l.mdfPlaques.map((x,j)=>j===i?{...x,l:+e.target.value}:x)}))}/></td>
      <td><input type="number" value={p.prix} step={0.1} style={{width:70}} onChange={e=>setLocal(l=>({...l,mdfPlaques:l.mdfPlaques.map((x,j)=>j===i?{...x,prix:+e.target.value}:x)}))}/></td>
      <td><input type="number" value={p.marge} style={{width:55}} onChange={e=>setLocal(l=>({...l,mdfPlaques:l.mdfPlaques.map((x,j)=>j===i?{...x,marge:+e.target.value}:x)}))}/></td>
      <td><Btn small variant="danger" onClick={()=>setLocal(l=>({...l,mdfPlaques:l.mdfPlaques.filter((_,j)=>j!==i)}))}>✕</Btn></td>
    </tr>
  ))}</tbody></table>
  <Btn small variant="ghost" style={{marginTop:12}} onClick={()=>setLocal(l=>({...l,mdfPlaques:[...l.mdfPlaques,{id:uid(),nom:"Nouveau MDF",epaisseur:16,L:2800,l:2070,prix:0,marge:20}]}))}>+ Ajouter</Btn>
</>)}
      {section==="matieres"&&(<><div style={{marginBottom:12,padding:"9px 13px",background:"rgba(59,130,246,.07)",border:"1px solid rgba(59,130,246,.2)",borderRadius:6,fontSize:12,color:G.accent2}}>Matières fournies client — le temps/coupe alimente le calcul issu du calepinage.</div><STitle>Matières</STitle><table><thead><tr><th>Nom</th><th>Type</th><th>Lng lame</th><th>Larg lame</th><th>t/coupe (s)</th><th/></tr></thead><tbody>{local.matieres.map((m,i)=>(<tr key={m.id}><td><input value={m.nom} style={{width:180}} onChange={e=>setLocal(l=>({...l,matieres:l.matieres.map((x,j)=>j===i?{...x,nom:e.target.value}:x)}))}/></td><td><select value={m.type} style={{width:140}} onChange={e=>setLocal(l=>({...l,matieres:l.matieres.map((x,j)=>j===i?{...x,type:e.target.value}:x)}))}>  <option value="rigide_clipable">rigide_clipable</option><option value="rigide">rigide</option><option value="souple">souple</option></select></td><td><input type="number" value={m.longueurLame} style={{width:70}} onChange={e=>setLocal(l=>({...l,matieres:l.matieres.map((x,j)=>j===i?{...x,longueurLame:+e.target.value}:x)}))}/></td><td><input type="number" value={m.largeurLame} style={{width:70}} onChange={e=>setLocal(l=>({...l,matieres:l.matieres.map((x,j)=>j===i?{...x,largeurLame:+e.target.value}:x)}))}/></td><td><input type="number" value={m.tempsParCoupe_sec} style={{width:70}} onChange={e=>setLocal(l=>({...l,matieres:l.matieres.map((x,j)=>j===i?{...x,tempsParCoupe_sec:+e.target.value}:x)}))}/></td><td><Btn small variant="danger" onClick={()=>setLocal(l=>({...l,matieres:l.matieres.filter((_,j)=>j!==i)}))}>✕</Btn></td></tr>))}</tbody></table><Btn small variant="ghost" style={{marginTop:12}} onClick={()=>setLocal(l=>({...l,matieres:[...l.matieres,{id:uid(),nom:"Nouvelle matière",type:"rigide_clipable",longueurLame:1285,largeurLame:192,tempsParCoupe_sec:12}]}))}>+ Ajouter</Btn></>)}
      {section==="calepinage"&&(<><STitle>Paramètres calepinage</STitle><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Marge rangée (mm)" hint="Joint de dilatation"><input type="number" value={local.calepinage.margeRangee} onChange={e=>setLocal(l=>({...l,calepinage:{...l.calepinage,margeRangee:+e.target.value}}))}/></Field><Field label="Seuil rejet reste (mm)"><input type="number" value={local.calepinage.seuilReste} onChange={e=>setLocal(l=>({...l,calepinage:{...l.calepinage,seuilReste:+e.target.value}}))}/></Field></div></>)}
      {section==="colles"&&(<><STitle>Colle OSAMA</STitle><div style={{marginBottom:10,fontSize:12,color:G.textMuted}}>Base : surface brute MDF (L+surcote)×(l+surcote) × nbFaces</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}><Field label="Prix (€/kg)"><input type="number" value={local.colleOsama.prix} onChange={e=>setLocal(l=>({...l,colleOsama:{...l.colleOsama,prix:+e.target.value}}))}/></Field><Field label="Conso (g/m²)"><input type="number" value={local.colleOsama.consoG_m2} onChange={e=>setLocal(l=>({...l,colleOsama:{...l.colleOsama,consoG_m2:+e.target.value}}))}/></Field></div><STitle>Colle blanche (clips)</STitle><div style={{marginBottom:10,fontSize:12,color:G.textMuted}}>Base : (L+l) mm par face</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Field label="Prix (€/kg)"><input type="number" value={local.colleBlanc.prix} onChange={e=>setLocal(l=>({...l,colleBlanc:{...l.colleBlanc,prix:+e.target.value}}))}/></Field><Field label="Conso (g/ml clip)"><input type="number" value={local.colleBlanc.consoG_ml} onChange={e=>setLocal(l=>({...l,colleBlanc:{...l.colleBlanc,consoG_ml:+e.target.value}}))}/></Field></div></>)}
      {section==="chants"&&(<><STitle>Chants ABS</STitle><table><thead><tr><th>Nom</th><th>Prix €/ml</th><th>Marge%</th><th>Major.%</th><th/></tr></thead><tbody>{local.chants.map((c,i)=>(<tr key={c.id}><td><input value={c.nom} onChange={e=>setLocal(l=>({...l,chants:l.chants.map((x,j)=>j===i?{...x,nom:e.target.value}:x)}))}/></td><td><input type="number" value={c.prix} step={0.1} style={{width:65}} onChange={e=>setLocal(l=>({...l,chants:l.chants.map((x,j)=>j===i?{...x,prix:+e.target.value}:x)}))}/></td><td><input type="number" value={c.marge} style={{width:55}} onChange={e=>setLocal(l=>({...l,chants:l.chants.map((x,j)=>j===i?{...x,marge:+e.target.value}:x)}))}/></td><td><input type="number" value={c.majoration} style={{width:55}} onChange={e=>setLocal(l=>({...l,chants:l.chants.map((x,j)=>j===i?{...x,majoration:+e.target.value}:x)}))}/></td><td><Btn small variant="danger" onClick={()=>setLocal(l=>({...l,chants:l.chants.filter((_,j)=>j!==i)}))}>✕</Btn></td></tr>))}</tbody></table><Btn small variant="ghost" style={{marginTop:12}} onClick={()=>setLocal(l=>({...l,chants:[...l.chants,{id:uid(),nom:"Nouveau chant",prix:1.5,marge:20,majoration:15}]}))}>+ Ajouter</Btn></>)}

{section==="emballages"&&(<><STitle>Emballages</STitle><table><thead><tr><th>Nom</th><th>Prix</th><th>Marge%</th><th>Unité</th><th/></tr></thead><tbody>{local.emballages.map((e,i)=>(<tr key={e.id}><td><input value={e.nom} onChange={ev=>setLocal(l=>({...l,emballages:l.emballages.map((x,j)=>j===i?{...x,nom:ev.target.value}:x)}))}/></td><td><input type="number" value={e.prix} style={{width:70}} onChange={ev=>setLocal(l=>({...l,emballages:l.emballages.map((x,j)=>j===i?{...x,prix:+ev.target.value}:x)}))}/></td><td><input type="number" value={e.marge} style={{width:55}} onChange={ev=>setLocal(l=>({...l,emballages:l.emballages.map((x,j)=>j===i?{...x,marge:+ev.target.value}:x)}))}/></td><td><select value={e.unite} style={{width:100}} onChange={ev=>setLocal(l=>({...l,emballages:l.emballages.map((x,j)=>j===i?{...x,unite:ev.target.value}:x)}))}>  <option value="panneau">panneau</option><option value="palette">palette</option><option value="lot">lot</option></select></td><td><Btn small variant="danger" onClick={()=>setLocal(l=>({...l,emballages:l.emballages.filter((_,j)=>j!==i)}))}>✕</Btn></td></tr>))}</tbody></table><Btn small variant="ghost" style={{marginTop:12}} onClick={()=>setLocal(l=>({...l,emballages:[...l.emballages,{id:uid(),nom:"Nouvel emballage",prix:0,marge:20,unite:"panneau"}]}))}>+ Ajouter</Btn></>)}

{section==="temps"&&(<>
        <STitle>Temps de coupe Gabbiani par matière (s/coupe)</STitle>
        <div style={{marginBottom:12,padding:"9px 13px",background:"rgba(232,160,32,.07)",border:"1px solid rgba(232,160,32,.2)",borderRadius:6,fontSize:12,color:G.accent}}>
          Utilisés automatiquement selon le type de matière — non modifiables dans le devis.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
          {[["Parquet (s/coupe)","parquet"],["Stratifié (s/coupe)","stratifie"],["Vinyle rigide (s/coupe)","vinyle_rigide"],["Vinyle souple (s/coupe)","vinyle_souple"]].map(([lbl,k])=>(
            <Field key={k} label={lbl}>
              <input type="number" value={local.tempsCoupeMatiere?.[k]||""} min={1}
                onChange={e=>setLocal(l=>({...l,tempsCoupeMatiere:{...(l.tempsCoupeMatiere||{}),[k]:+e.target.value}}))}/>
            </Field>
          ))}
        </div>
        <STitle>Temps unitaires process</STitle><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{[["Encollage OSAMA/face (s)","encodageOsama_sec"],["Clipsage/face (s)","clipsage_sec"],["Pose colle blanche (s/ml)","colleBlanc_sec_ml"],["Collage manuel/face (s)","collagManuel_sec"],["Vitesse chant (m/min)","chantVitesse_m_min"],["Temps fixe chant (s)","chantTempsFixe_sec"],["Étiquette/face (s)","etiquette_sec"],["Contrôle/nettoyage/face (s)","controleNettoyage_sec"],["Cerclage palette (s)","cerclage_sec_palette"],["Picking/panneau (s)","picking_sec"],["Prise info (min)","priseInfo_min"],["Débit lattes (s/ml)","debitLattes_sec_ml"]].map(([lbl,k])=><Field key={k} label={lbl}><input type="number" value={local.temps[k]} onChange={e=>setLocal(l=>({...l,temps:{...l.temps,[k]:+e.target.value}}))}/></Field>)}</div><STitle style={{marginTop:14}}>Détourage CNC</STitle><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{Object.entries(local.temps.detorage).map(([k,v])=><Field key={k} label={k.replace(/_/g," ")}><input type="number" value={v} onChange={e=>setLocal(l=>({...l,temps:{...l.temps,detorage:{...l.temps.detorage,[k]:+e.target.value}}}))}/></Field>)}</div></>)}
      {section==="generaux"&&(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{[["Surcote/côté (mm)","surcoteParCote_mm"],["Trait de scie (mm)","traitScie_mm"],["Seuil vert (%)","seuilVert"],["Seuil orange (%)","seuilOrange"],["Marge achat défaut (%)","margeAchatDefaut"]].map(([lbl,k])=><Field key={k} label={lbl}><input type="number" value={local.generaux[k]} onChange={e=>setLocal(l=>({...l,generaux:{...l.generaux,[k]:+e.target.value}}))}/></Field>)}</div>)}
      {section==="commerciaux"&&(<><STitle>Commerciaux</STitle>{local.commerciaux.map((c,i)=>(<div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8,marginBottom:8}}><input placeholder="Nom Prénom" value={c.nom} onChange={e=>setLocal(l=>({...l,commerciaux:l.commerciaux.map((x,j)=>j===i?{...x,nom:e.target.value}:x)}))}/><input type="email" placeholder="email@" value={c.email} onChange={e=>setLocal(l=>({...l,commerciaux:l.commerciaux.map((x,j)=>j===i?{...x,email:e.target.value}:x)}))}/><Btn small variant="danger" onClick={()=>setLocal(l=>({...l,commerciaux:l.commerciaux.filter((_,j)=>j!==i)}))}>✕</Btn></div>))}<Btn small variant="ghost" style={{marginTop:8}} onClick={()=>setLocal(l=>({...l,commerciaux:[...l.commerciaux,{nom:"",email:""}]}))}>+ Ajouter</Btn></>)}

{section==="emails"&&(<><STitle>Emails</STitle><Field label="Email interne production" hint="Reçoit le mail interne à chaque chiffrage"><input type="email" value={local.emailInterne} onChange={e=>setLocal(l=>({...l,emailInterne:e.target.value}))} placeholder="production@entreprise.fr"/></Field></>)}
    </Card>
  </div>);
}
