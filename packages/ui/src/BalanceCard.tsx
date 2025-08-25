export function BalanceCard({ loading, balance }: { loading: boolean; balance: any }) {
    return (
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-md p-4 flex flex-col items-center justify-center">
        {loading ? (
          <div className="w-full flex items-center justify-center h-16">
            {/* Keep using your existing Loading component in page, here we only show a placeholder so importing Loading remains optional */}
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">Balance: {balance?.amount}</h2>
            <p className="text-sm text-gray-600">Locked: {balance?.locked}</p>
          </div>
        )}
      </div>
    );
  }