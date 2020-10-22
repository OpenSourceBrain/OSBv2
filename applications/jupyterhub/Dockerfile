FROM jupyterhub/k8s-hub:0.9.0
USER root

COPY src src
RUN pip install ./src/harness_jupyter
RUN pip install ./src/chauthenticator
RUN pip install ./src/osb_jupyter
RUN chmod 777 /usr/local/lib/python3.6/dist-packages/  -R

COPY --chown=1000:1000 theming/page.html /usr/local/share/jupyterhub/templates/page.html
COPY --chown=1000:1000 theming/spawn_pending.html /usr/local/share/jupyterhub/templates/spawn_pending.html
COPY --chown=1000:1000 theming/hot_fix_for_eventsource.js /usr/local/share/jupyterhub/static/hot_fix_for_eventsource.js

USER jovyan
