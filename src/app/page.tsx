"use client";

import { useMemo, useState } from "react";

type Car = {
  name: string;
  type: "new" | "used";
  price: number;
  fuel: "essence" | "diesel" | "hybride" | "electrique";
  gearbox: "auto" | "manuelle";
  body: "citadine" | "berline" | "suv" | "utilitaire";
  usageFit: Array<"ville" | "autoroute" | "mixte">;
  seats: number;
  summary: string;
  costPer100km: number;
  intents: Intent[];
  reliability: "high" | "medium";
};

type Intent =
  | "city"
  | "autoroute"
  | "family"
  | "pro"
  | "vtc"
  | "delivery"
  | "loisirs"
  | "offroad";

const intentLabels: Record<Intent, string> = {
  city: "Trajets urbains quotidiens",
  autoroute: "Longs trajets / autoroute",
  family: "Famille / enfants / bagages",
  pro: "Usage société / véhicule de service",
  vtc: "VTC/Taxi (clients à bord)",
  delivery: "Livraison / utilitaire léger",
  loisirs: "Week-end / sorties loisirs",
  offroad: "Routes dégradées / piste",
};

const cars: Car[] = [
  {
    name: "Dacia Logan 1.0",
    type: "new",
    price: 135_000,
    fuel: "essence",
    gearbox: "manuelle",
    body: "berline",
    usageFit: ["ville", "mixte"],
    seats: 5,
    summary: "Berline budget simple, coûts bas, facile à entretenir.",
    costPer100km: 70,
    intents: ["city", "family", "pro"],
    reliability: "medium",
  },
  {
    name: "Dacia Sandero Stepway",
    type: "new",
    price: 175_000,
    fuel: "essence",
    gearbox: "manuelle",
    body: "citadine",
    usageFit: ["ville", "mixte"],
    seats: 5,
    summary: "Polyvalente, garde au sol haute, idéale trajets quotidien.",
    costPer100km: 75,
    intents: ["city", "family", "loisirs"],
    reliability: "medium",
  },
  {
    name: "Hyundai i20 Occasion 2021",
    type: "used",
    price: 150_000,
    fuel: "essence",
    gearbox: "manuelle",
    body: "citadine",
    usageFit: ["ville", "mixte"],
    seats: 5,
    summary: "Occasion récente, bon niveau d’équipement et fiabilité.",
    costPer100km: 68,
    intents: ["city", "family", "vtc"],
    reliability: "medium",
  },
  {
    name: "Toyota Corolla Hybride",
    type: "new",
    price: 290_000,
    fuel: "hybride",
    gearbox: "auto",
    body: "berline",
    usageFit: ["ville", "mixte", "autoroute"],
    seats: 5,
    summary: "Hybride sobre, fiable, bon confort pour longs trajets.",
    costPer100km: 55,
    intents: ["city", "autoroute", "pro", "vtc"],
    reliability: "high",
  },
  {
    name: "Kia Sportage Occasion 2019",
    type: "used",
    price: 240_000,
    fuel: "diesel",
    gearbox: "auto",
    body: "suv",
    usageFit: ["mixte", "autoroute"],
    seats: 5,
    summary: "SUV spacieux, bon pour famille et autoroute.",
    costPer100km: 80,
    intents: ["family", "autoroute", "loisirs", "pro"],
    reliability: "medium",
  },
  {
    name: "MG ZS EV",
    type: "new",
    price: 320_000,
    fuel: "electrique",
    gearbox: "auto",
    body: "suv",
    usageFit: ["ville", "mixte"],
    seats: 5,
    summary: "SUV électrique abordable, idéal urbain si recharge possible.",
    costPer100km: 30,
    intents: ["city", "pro", "vtc"],
    reliability: "medium",
  },
];

type FormState = {
  budget: number;
  usage: "ville" | "autoroute" | "mixte";
  fuel: "essence" | "diesel" | "hybride" | "electrique" | "indifferent";
  type: "new" | "used" | "both";
  seats: number;
  intents: Intent[];
  driverCount: number;
  gearbox: "auto" | "manuelle" | "indifferent";
  body: "citadine" | "berline" | "suv" | "utilitaire" | "indifferent";
  kmYear: number;
  priorityReliability: boolean;
  priorityCost: boolean;
};

const defaultForm: FormState = {
  budget: 200000,
  usage: "mixte",
  fuel: "indifferent",
  type: "both",
  seats: 5,
  intents: [],
  driverCount: 1,
  gearbox: "indifferent",
  body: "indifferent",
  kmYear: 12000,
  priorityReliability: true,
  priorityCost: true,
};

export default function Home() {
  const [form, setForm] = useState<FormState>(defaultForm);

  const costPerYear = (car: Car) =>
    Math.round((car.costPer100km * form.kmYear) / 100);

  const results = useMemo(() => {
    return cars
      .filter((car) => {
        const fitsBudget = car.price <= form.budget * 1.05;
        const fitsType = form.type === "both" ? true : car.type === form.type;
        const fitsFuel =
          form.fuel === "indifferent" ? true : car.fuel === form.fuel;
        const fitsSeats = car.seats >= form.seats;
        const fitsUsage = car.usageFit.includes(form.usage);
        const fitsGearbox =
          form.gearbox === "indifferent" ? true : car.gearbox === form.gearbox;
        const fitsBody =
          form.body === "indifferent" ? true : car.body === form.body;
        return (
          fitsBudget &&
          fitsType &&
          fitsFuel &&
          fitsSeats &&
          fitsUsage &&
          fitsGearbox &&
          fitsBody
        );
      })
      .map((car) => {
        let score = 0;
        if (car.price <= form.budget) score += 2;
        if (car.fuel === form.fuel) score += 2;
        if (form.fuel === "indifferent") score += 1;
        if (car.type === form.type) score += 1;
        if (car.costPer100km < 65) score += 1;
        if (form.usage === "autoroute" && car.usageFit.includes("autoroute")) {
          score += 1;
        }
        if (form.gearbox !== "indifferent" && car.gearbox === form.gearbox) {
          score += 1;
        }
        if (form.body !== "indifferent" && car.body === form.body) {
          score += 1;
        }
        if (form.intents.length > 0) {
          const matches = form.intents.filter((i) =>
            car.intents.includes(i),
          ).length;
          score += matches * 1.5;
        }
        if (form.priorityReliability && car.reliability === "high") {
          score += 1.5;
        }
        if (form.priorityCost && car.costPer100km <= 70) {
          score += 1;
        }
        return { car, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [form]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-40 blur-3xl">
          <div className="absolute -left-10 top-10 h-64 w-64 rotate-12 rounded-full bg-amber-400/30" />
          <div className="absolute right-0 top-24 h-72 w-72 rotate-6 rounded-full bg-indigo-500/20" />
        </div>
        <main className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:px-10 md:py-16">
          <header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-amber-300">
                  Your-Car · اختار سيارتك
                </p>
                <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">
                  Conseiller intelligent pour trouver la bonne voiture
                </h1>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
                <span>🎯</span>
                <span>Recommandations ciblées</span>
              </div>
            </div>
            <p className="text-base text-slate-200 md:text-lg">
              Formulaire clair + critères avancés = 3–4 modèles pertinents pour
              vos trajets au Maroc. Pensé pour un utilisateur néophyte : options
              guidées, badges, et explications simples.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                Neuf & Occasion
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                Budget & coûts d’usage
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                Fiabilité & besoins pros
              </span>
            </div>
          </header>

          <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Paramétrez votre profil
                </h2>
                <span className="text-xs text-slate-300">
                  UI conviviale · 2 min
                </span>
              </div>
              <form className="space-y-4 text-sm text-slate-100">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="flex flex-col gap-1">
                    Budget max (MAD)
                    <input
                      type="number"
                    value={form.budget}
                    min={80000}
                    max={800000}
                    step={5000}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        budget: Number(e.target.value || 0),
                      }))
                    }
                    className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-base text-white outline-none ring-amber-400/0 transition focus:ring-2"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  Kilométrage annuel estimé
                  <input
                    type="number"
                    value={form.kmYear}
                    min={3000}
                    max={40000}
                    step={1000}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        kmYear: Number(e.target.value || 0),
                      }))
                    }
                    className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-base text-white outline-none ring-amber-400/0 transition focus:ring-2"
                  />
                </label>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="flex flex-col gap-1">
                      Usage principal
                  <select
                    value={form.usage}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        usage: e.target.value as FormState["usage"],
                      }))
                    }
                    className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-base text-white outline-none ring-amber-400/0 transition focus:ring-2"
                  >
                    <option value="ville">Ville</option>
                    <option value="autoroute">Autoroute</option>
                    <option value="mixte">Mixte</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  Carburant préféré
                  <select
                    value={form.fuel}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        fuel: e.target.value as FormState["fuel"],
                      }))
                    }
                    className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-base text-white outline-none ring-amber-400/0 transition focus:ring-2"
                  >
                    <option value="indifferent">Peu importe</option>
                    <option value="essence">Essence</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybride">Hybride</option>
                    <option value="electrique">Électrique</option>
                  </select>
                </label>
              </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="flex flex-col gap-1">
                    Neuf ou occasion
                    <select
                      value={form.type}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        type: e.target.value as FormState["type"],
                      }))
                    }
                    className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-base text-white outline-none ring-amber-400/0 transition focus:ring-2"
                  >
                    <option value="both">Peu importe</option>
                    <option value="new">Neuf seulement</option>
                    <option value="used">Occasion</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  Boite de vitesses
                  <select
                    value={form.gearbox}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        gearbox: e.target.value as FormState["gearbox"],
                      }))
                    }
                    className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-base text-white outline-none ring-amber-400/0 transition focus:ring-2"
                  >
                    <option value="indifferent">Peu importe</option>
                    <option value="auto">Automatique</option>
                    <option value="manuelle">Manuelle</option>
                  </select>
                </label>
              </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="flex flex-col gap-1">
                    Type de carrosserie
                    <select
                      value={form.body}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        body: e.target.value as FormState["body"],
                      }))
                    }
                    className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-base text-white outline-none ring-amber-400/0 transition focus:ring-2"
                  >
                    <option value="indifferent">Peu importe</option>
                    <option value="citadine">Citadine/compacte</option>
                    <option value="berline">Berline</option>
                    <option value="suv">SUV/Crossover</option>
                    <option value="utilitaire">Utilitaire</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  Places minimales
                  <input
                    type="number"
                    min={2}
                    max={7}
                    value={form.seats}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        seats: Number(e.target.value || 0),
                      }))
                    }
                    className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-base text-white outline-none ring-amber-400/0 transition focus:ring-2"
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1">
                  Combien de conducteurs utiliseront la voiture ?
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={form.driverCount}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        driverCount: Number(e.target.value || 1),
                      }))
                    }
                    className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-base text-white outline-none ring-amber-400/0 transition focus:ring-2"
                  />
                </label>

                <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <span className="text-sm font-semibold text-white">
                    Priorités
                  </span>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.priorityReliability}
                      onChange={() =>
                        setForm((prev) => ({
                          ...prev,
                          priorityReliability: !prev.priorityReliability,
                        }))
                      }
                      className="h-4 w-4 accent-amber-400"
                    />
                    Fiabilité / tranquillité
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.priorityCost}
                      onChange={() =>
                        setForm((prev) => ({
                          ...prev,
                          priorityCost: !prev.priorityCost,
                        }))
                      }
                      className="h-4 w-4 accent-amber-400"
                    />
                    Coût d’usage bas
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-white">
                  Usage / besoins (cochez tout ce qui s’applique)
                </p>
                <div className="grid gap-2 md:grid-cols-2">
                  {(Object.keys(intentLabels) as Intent[]).map((intent) => (
                    <label
                      key={intent}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-100"
                    >
                      <input
                        type="checkbox"
                        checked={form.intents.includes(intent)}
                        onChange={() =>
                          setForm((prev) => {
                            const exists = prev.intents.includes(intent);
                            return {
                              ...prev,
                              intents: exists
                                ? prev.intents.filter((i) => i !== intent)
                                : [...prev.intents, intent],
                            };
                          })
                        }
                        className="h-4 w-4 accent-amber-400"
                      />
                      <span className="text-sm">{intentLabels[intent]}</span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
            <div className="flex flex-wrap gap-2 text-xs text-slate-200">
              <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1">
                Mock data locale
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                Filtres budget + usage + fuel
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                4 suggestions max
              </span>
            </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Suggestions (beta)
                </h2>
                <span className="text-xs text-slate-300">
                  Calculées sur vos critères
                </span>
              </div>
              {results.length === 0 ? (
                <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300">
                  Aucun modèle ne correspond à ces critères. Essayez d’augmenter
                  le budget ou de détendre le carburant.
                </p>
              ) : (
                <div className="grid gap-3">
                  {results.map(({ car, score }) => (
                    <article
                      key={car.name}
                      className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-white/5 p-5 shadow-lg transition hover:-translate-y-0.5 hover:border-amber-300/40"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-amber-300">
                            {car.type === "new" ? "Neuf" : "Occasion"}
                          </p>
                          <h3 className="text-xl font-semibold text-white">
                            {car.name}
                          </h3>
                          <p className="text-xs text-slate-300">
                            {car.body} · {car.gearbox === "auto" ? "Auto" : "Manuelle"} ·{" "}
                            {car.reliability === "high" ? "Fiabilité élevée" : "Fiabilité standard"}
                          </p>
                        </div>
                        <div className="text-right text-sm text-slate-200">
                          <p className="font-semibold">
                            {car.price.toLocaleString("fr-MA")} MAD
                          </p>
                          <p className="text-xs text-amber-200">
                            Score {score.toFixed(1)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-200">
                        {car.summary}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-100">
                        <span className="rounded-full bg-slate-800 px-3 py-1">
                          {car.fuel}
                        </span>
                        <span className="rounded-full bg-slate-800 px-3 py-1">
                          {car.usageFit.join(" / ")}
                        </span>
                        <span className="rounded-full bg-slate-800 px-3 py-1">
                          {car.seats} places
                        </span>
                        <span className="rounded-full bg-slate-800 px-3 py-1">
                          ~{car.costPer100km} MAD / 100 km
                        </span>
                        <span className="rounded-full bg-slate-800 px-3 py-1">
                          ~{costPerYear(car).toLocaleString("fr-MA")} MAD/an
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200 shadow-lg backdrop-blur">
            <h3 className="text-base font-semibold text-white">
              Comment ça marche ?
            </h3>
            <ol className="mt-3 grid gap-3 md:grid-cols-3">
              <li className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                1) Vous saisissez budget, usage, fuel, carrosserie, boîte, besoins pros/famille.
              </li>
              <li className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                2) Filtrage + scoring (coût/km, fiabilité, correspondance usages, priorités).
              </li>
              <li className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                3) Affichage de 3–4 cartes avec badges, coût estimé/an et résumé clair.
              </li>
            </ol>
            <p className="mt-3 text-xs text-slate-300">
              Prochaines étapes: brancher de vraies données Maroc (catalogue neuf + annonces),
              ajouter contact/lead et comparateur côte-à-côte.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
