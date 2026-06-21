              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-white/12 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-semibold">{value}</p>
                  <p className="mt-1 text-xs font-medium text-teal-50/72">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 rounded-2xl border border-white/12 bg-white/10 p-5 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Flujo del proceso PI</p>
                <p className="text-xs text-teal-50/70">Planeacion, evaluacion y cierre academico.</p>
              </div>
              <BarChart3 className="h-5 w-5 text-teal-200" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["Registro", "Rubricas", "Evaluacion", "Reportes"].map((step, index) => (
                <div key={step} className="rounded-lg bg-white/10 p-3">
                  <div className="mb-3 h-1.5 rounded-full bg-white" style={{ opacity: 1 - index * 0.16 }} />
                  <p className="text-xs font-medium text-teal-50/86">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-8 sm:px-8">
          <div className="w-full max-w-[520px] space-y-6">
            <div className="space-y-3 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--role-primary-dark)] text-white">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--role-text)]">UPQ</p>
                <h1 className="text-2xl font-semibold tracking-tight">SIGEP-PI</h1>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--role-text)]">Acceso institucional</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Inicia sesion</h2>
              <p className="text-sm leading-6 text-slate-600">
                Selecciona un perfil de prueba para presentar el sistema por rol sin exponer credenciales.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {accessProfiles.map((profile) => {
                const Icon = profile.icon
                const isSelected = selectedRole === profile.role

                return (
                  <button
                    key={profile.role}
                    type="button"
                    onClick={() => handleProfileSelect(profile)}
                    className={cn(
                      "rounded-xl border bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                      isSelected ? "border-[var(--role-primary)] ring-2 ring-[var(--role-primary)]/15" : "border-slate-200"
                    )}
                  >
                    <div className={cn("mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white", profile.accent)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{profile.title}</p>
                    <p className="mt-1 text-xs leading-4 text-slate-500">{profile.subtitle}</p>
                  </button>
                )
              })}
            </div>

            <Card className="border-slate-200 bg-white shadow-xl shadow-slate-200/60">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="rounded-xl border border-[var(--role-border)] bg-[var(--role-soft)] p-4 transition-colors duration-300">
                    <div className="flex items-start gap-3">
                      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white", selectedProfile.accent)}>
                        <selectedProfile.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{selectedProfile.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">
                          {selectedProfile.permissions.join(" · ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo institucional</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="usuario@upq.mx"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 border-slate-200 bg-slate-50 pl-10 text-sm focus-visible:ring-[var(--role-primary)]"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Contrasena</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Contrasena institucional"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 border-slate-200 bg-slate-50 pl-10 pr-10 text-sm focus-visible:ring-[var(--role-primary)]"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900"
                        aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full bg-[var(--role-primary)] font-semibold text-white hover:bg-[var(--role-primary-dark)]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Validando acceso...
                      </>
                    ) : (
                      <>
                        Entrar al panel
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full gap-2"
                    onClick={handleGoogleLogin}
                    disabled={isSubmitting}
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-900">
                      G
                    </span>
                    Continuar con Google
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-3 rounded-xl border border-slate-200 bg-white/70 p-4 text-xs text-slate-600 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--role-text)]" />
                Permisos visibles por rol
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[var(--role-text)]" />
                Datos preparados para demo
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
