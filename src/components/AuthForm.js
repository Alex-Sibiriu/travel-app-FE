import { Form, Link, useNavigation, useSearchParams } from "react-router-dom";
import ColoredBtn from "./UI/ColoredBtn";
import InputAuth from "./UI/InputAuth";

export default function AuthForm() {
	const [searchParams] = useSearchParams();
	const isLogin = searchParams.get("mode") === "login";
	const SessionExpired = searchParams.get("message");

	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";

	return (
		<div className="max-w-[800px] shadow-md shadow-zinc-800 py-8 mt-8 mx-auto font-bold text-orange-100 bg-opacity-90 bg-gradient-to-b from-orange-600 to-orange-400 rounded-xl text-center">
			<Form method="POST">
				<h2 className="text-3xl capitalize pb-4">
					{isLogin ? "Accedi" : "Registrati"}
				</h2>

				{SessionExpired && (
					<h3 className="py-4 text-red-800">
						Sessione scaduta, effettua nuovamente l'accesso!
					</h3>
				)}

				{!isLogin && (
					<div className="py-4 w-4/5 mx-auto">
						<InputAuth label="Nome" id="name" type="text" required />
					</div>
				)}
				<div className="py-4 w-4/5 mx-auto">
					<InputAuth label="Email" id="email" type="email" required />
				</div>

				<div className="py-4 w-4/5 mx-auto">
					<InputAuth label="Password" id="password" type="password" required />
				</div>

				{!isLogin && (
					<div className="py-4 w-4/5 mx-auto flex content-center justify-center">
						<InputAuth
							label="Conferma Password"
							id="password_confirmation"
							type="password"
							required
						/>
					</div>
				)}

				<div className="flex justify-center gap-8 py-4">
					<Link to={`?mode=${isLogin ? "register" : "login"}`}>
						<ColoredBtn
							color={"transparent"}
							type="button"
							disabled={isSubmitting}
						>
							{isLogin ? "Registrati" : "Accedi"}
						</ColoredBtn>
					</Link>
					<ColoredBtn color={"orange"}>
						{isSubmitting ? "Inviando..." : "Invia"}
					</ColoredBtn>
				</div>
			</Form>
		</div>
	);
}
