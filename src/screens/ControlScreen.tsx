import { Layout } from '../components/Layout';
import { MoveControls } from '../components/MoveControls';
import { useCommands, usePrinterStore } from '../stores/usePrinterStore';

export function ControlScreen() {
  const commands = useCommands();
  const macros = usePrinterStore((state) => state.macros);

  const runAction = usePrinterStore((state) => state.runAction);


  return (
    <Layout title="Control" subtitle=" ">


      <MoveControls />

      <section className="card">
        <div className="card-label">One-tap Macros</div>
        <div className="card-title">Macros</div>
        {macros.slice(0, 5).map((macro) => (
          <button
            type="button"
            className="macro-item button-reset"
            key={macro}
            onClick={() => runAction(`Run ${macro}`, () => commands.runMacro(macro))}
          >
            {macro}
          </button>
        ))}
        {macros.length === 0 ? <div className="macro-item">No macros discovered.</div> : null}
      </section>


    </Layout>
  );
}
